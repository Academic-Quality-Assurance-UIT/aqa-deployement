import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SurveyApiClient } from './survey-api-client';
import { CrawlJob } from '../entities/crawl-job.entity';
import { CrawlStagingData } from '../entities/crawl-staging-data.entity';
import { SurveyListConfig } from '../entities/survey-list-config.entity';
import { SurveyCrawlHistory } from '../entities/survey-crawl-history.entity';
import { CrawlJobType } from '../enums/crawl-job-type.enum';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CrawlSubjectSurveyService {
  private readonly logger = new Logger(CrawlSubjectSurveyService.name);

  constructor(
    private readonly apiClient: SurveyApiClient,
    @InjectRepository(CrawlJob)
    private readonly crawlJobRepo: Repository<CrawlJob>,
    @InjectRepository(CrawlStagingData)
    private readonly stagingRepo: Repository<CrawlStagingData>,
    @InjectRepository(SurveyListConfig)
    private readonly surveyListRepo: Repository<SurveyListConfig>,
    @InjectRepository(SurveyCrawlHistory)
    private readonly surveyCrawlHistoryRepo: Repository<SurveyCrawlHistory>,
  ) {}

  async crawl(
    crawlJobId: string,
    semester?: string,
    surveyConfigIds?: string[],
  ): Promise<{ total: number; success: number; failed: number }> {
    const surveyList = await this.getSurveyList(semester, surveyConfigIds);
    this.logger.log(`Found ${surveyList.length} subject surveys to crawl`);

    let successCount = 0;
    let errorCount = 0;
    const errors: any[] = [];
    
    let globalTotalData = 0;
    let globalProgress = 0;
    let globalDetailTotal = 0;
    let globalDetailProgress = 0;

    for (const surveyInfo of surveyList) {
      if (!(await this.isJobRunning(crawlJobId))) {
        this.logger.warn(`Job ${crawlJobId} has been stopped. Aborting crawl.`);
        return {
          total: surveyList.length,
          success: successCount,
          failed: errorCount,
        };
      }
      try {
        this.logger.log(
          `Processing survey: ${surveyInfo.title} (SID: ${surveyInfo.sid})`,
        );

        let currentDetailTotal = 0;
        
        const historyRecord = await this.surveyCrawlHistoryRepo.save({
          survey_list_config_id: surveyInfo.id,
          crawl_job_id: crawlJobId,
          sid: surveyInfo.sid,
          status: 'RUNNING',
          records_fetched: 0,
          started_at: new Date(),
        });
        
        // --- 1. Fetch Student Details (Detailed invitations) ---
        const { data: rawStudents, attributes } = await this.apiClient.getAllSurveyDetail(
          surveyInfo.sid,
          { limit: 50 },
          crawlJobId,
          async (fetched, total) => {
            // During student data fetching, we update the detail progress.
            currentDetailTotal = Number(total || 0);
            await this.crawlJobRepo.update(crawlJobId, {
              detail_progress: Number(globalDetailProgress) + Number(fetched || 0),
              detail_total: Number(globalDetailTotal) + currentDetailTotal,
              last_activity_at: new Date(),
            });
          }
        );
        globalDetailProgress += rawStudents.length;
        globalDetailTotal += currentDetailTotal;

        // Normalize attribute keys for columns (lower case, trim)
        const attrMapping: Record<string, string> = {};
        for (const [key, value] of Object.entries(attributes || {})) {
          attrMapping[key] = (value as string).toLowerCase().trim();
        }

        // Map and Stage Student data
        const studentStagingValues = rawStudents.map((student: any) => {
          const mappedData: any = {
            tid: student.tid,
            sid: Number(surveyInfo.sid),
            firstname: student.firstname,
            lastname: student.lastname,
            email: student.email,
            token: student.token,
            completed_at: student.completed,
            usesleft: Number(student.usesleft || 0),
            semester_name: surveyInfo.semester_name,
          };

          // Map attributes (attribute_1 -> mssv, etc.)
          for (const [attrKey, colName] of Object.entries(attrMapping)) {
            mappedData[colName] = student[attrKey];
          }

          return {
            crawl_job_id: crawlJobId,
            data_type: 'student',
            data: mappedData,
            key: student.tid,
          };
        });

        // Batch insert student staging data
        if (studentStagingValues.length > 0) {
          const batchSize = 500;
          for (let i = 0; i < studentStagingValues.length; i += batchSize) {
            await this.stagingRepo
              .createQueryBuilder()
              .insert()
              .into(CrawlStagingData)
              .values(studentStagingValues.slice(i, i + batchSize))
              .orIgnore()
              .execute();
          }
        }

        // --- 2. Fetch Survey Answers (Current flow) ---
        let currentAnswersTotal = 0;
        let currentAnswersFetched = 0;
        const surveyData = await this.apiClient.getAllSurveyAnswers(
          surveyInfo.sid,
          crawlJobId,
          async (fetched, total, batchData) => {
            currentAnswersTotal = total;
            currentAnswersFetched = fetched;
            
            // Process the batch immediately to save into staging database
            if (batchData && batchData.length > 0) {
              for (const responseData of batchData) {
                const processed = this.processResponse(
                  responseData,
                  surveyInfo,
                  studentStagingValues.map(s => s.data),
                );
                const valuesToInsert = processed.map((item) => {
                  let key = item.data?.display_name || uuidv4();
                  if (item.type === 'point_answer' || item.type === 'comment') {
                    key = uuidv4();
                  }

                  return {
                    crawl_job_id: crawlJobId,
                    data_type: item.type,
                    data: item.data,
                    key,
                  };
                });

                if (valuesToInsert.length > 0) {
                  await this.stagingRepo
                    .createQueryBuilder()
                    .insert()
                    .into(CrawlStagingData)
                    .values(valuesToInsert)
                    .orIgnore()
                    .execute();
                }
              }
            }
            
            await this.crawlJobRepo.update(crawlJobId, {
              progress: Number(globalProgress) + Number(fetched || 0),
              total_data: Number(globalTotalData) + Number(currentAnswersTotal || 0),
            });
          }
        );
        globalProgress += currentAnswersFetched;
        globalTotalData += currentAnswersTotal;

        await this.surveyListRepo.update(surveyInfo.id, { last_crawled_at: new Date() });

        await this.surveyCrawlHistoryRepo.update(historyRecord.id, {
          status: 'SUCCESS',
          records_fetched: currentAnswersTotal,
          completed_at: new Date(),
        });

        successCount++;
        // Delay between surveys
        await new Promise((r) => setTimeout(r, 2000));
      } catch (error: any) {
        errorCount++;
        errors.push({
          sid: surveyInfo.sid,
          title: surveyInfo.title,
          error: error.message,
        });
        
        await this.surveyCrawlHistoryRepo.insert({
          survey_list_config_id: surveyInfo.id,
          crawl_job_id: crawlJobId,
          sid: surveyInfo.sid,
          status: 'FAILED',
          records_fetched: 0,
          error_message: error.message,
          started_at: new Date(),
          completed_at: new Date(),
        });
        
        this.logger.error(
          `Error crawling SID ${surveyInfo.sid}: ${error.message}`,
        );
      }
    }

    return {
      total: surveyList.length,
      success: successCount,
      failed: errorCount,
    };
  }

  private async isJobRunning(jobId: string): Promise<boolean> {
    const job = await this.crawlJobRepo.findOne({
      where: { crawl_job_id: jobId },
      select: ['status'],
    });
    return job?.status === 'RUNNING';
  }

  private async getSurveyList(semester?: string, surveyConfigIds?: string[]): Promise<any[]> {
    const query = this.surveyListRepo
      .createQueryBuilder('s')
      .where('s.survey_type = :type', {
        type: CrawlJobType.SUBJECT_SURVEY,
      })
      .andWhere('s.is_active = true');

    if (semester) {
      query.andWhere('s.semester_name = :semester', { semester });
    }

    if (surveyConfigIds && surveyConfigIds.length > 0) {
      query.andWhere('s.id IN (:...surveyConfigIds)', { surveyConfigIds });
    }

    return query.getMany();
  }

  private processResponse(
    responseData: any,
    surveyInfo: any,
    surveyDetailData: any[],
  ): Array<{ type: string; data: any }> {
    const results: Array<{ type: string; data: any }> = [];

    // Extract faculty
    const facultyData = this.findQuestionByCode(responseData, 'nganhhoc');
    if (facultyData?.value) {
      results.push({
        type: 'faculty',
        data: {
          display_name: facultyData.value,
          full_name: null,
          is_displayed: true,
        },
      });
    }

    // Extract subject
    const subjectData = this.findQuestionByCode(responseData, 'tenmh');
    if (subjectData?.value) {
      results.push({
        type: 'subject',
        data: {
          display_name: subjectData.value,
          faculty_name: facultyData?.value || null,
        },
      });
    }

    // Extract lecturer
    const lecturerData = this.findQuestionByCode(responseData, 'tengv');
    if (lecturerData?.value) {
      results.push({
        type: 'lecturer',
        data: { display_name: lecturerData.value },
      });
    }

    // Extract semester
    const semesterYear = surveyInfo.semester_name?.includes(', ') 
      ? surveyInfo.semester_name.split(', ')[1] 
      : surveyInfo.year;
    
    results.push({
      type: 'semester',
      data: {
        display_name: surveyInfo.semester_name,
        type: surveyInfo.semester_type,
        year: semesterYear,
        search_string: `${semesterYear}, ${surveyInfo.semester_type}`,
      },
    });

    // Extract class
    const classData = this.findQuestionByCode(responseData, 'mamh');
    const className = classData?.value;
    if (className) {
      let program = null;
      if (surveyDetailData?.length > 0) {
        const matchingDetail = surveyDetailData.find(
          (detail: any) => detail.malop === className,
        );
        if (matchingDetail) program = matchingDetail.hedt;
      }

      results.push({
        type: 'class',
        data: {
          display_name: className,
          semester_name: surveyInfo.semester_name,
          program,
          class_type: surveyInfo.type,
          subject_name: subjectData?.value || null,
          lecturer_name: lecturerData?.value || null,
          total_student: null,
          participating_student: null,
        },
      });
    }

    // --- New Filtering Logic for Criteria ---
    // 1. Find the parent question with code: "MH1" and parent_qid: "0"
    let parentQuestionEntry: any = null;
    for (const [, questionData] of Object.entries(responseData)) {
      if (
        questionData &&
        typeof questionData === 'object' &&
        (questionData as any).code === 'MH1' &&
        String((questionData as any).parent_qid) === '0'
      ) {
        parentQuestionEntry = questionData;
        break;
      }
    }

    if (!parentQuestionEntry) {
      this.logger.error(
        `Parent question (code: MH1, parent_qid: 0) not found for SID: ${surveyInfo.sid}. Skipping criteria extraction.`,
      );
    } else {
      const { sub_questions, sub_question_fields } = parentQuestionEntry;

      if (sub_questions && Array.isArray(sub_questions)) {
        for (const subQuestion of sub_questions) {
          // Add criteria
          results.push({
            type: 'criteria',
            data: {
              display_name: subQuestion.question,
              index: null,
              semester_id: null,
            },
          });

          // Add point if available
          if (sub_question_fields?.[subQuestion.title]) {
            const pointValue = this.convertPointValue(
              sub_question_fields[subQuestion.title],
            );
            if (pointValue > 0 && className) {
              results.push({
                type: 'point_answer',
                data: {
                  max_point: 4,
                  criteria_name: subQuestion.question,
                  class_name: className,
                  semester_name: surveyInfo.semester_name,
                  point: pointValue,
                },
              });
            }
          }
        }
      }
    }

    // Comments extraction (keeping previous logic)
    for (const [, questionData] of Object.entries(responseData)) {
      if (!questionData || typeof questionData !== 'object') continue;
      const qd = questionData as any;
      const { code, value } = qd;

      if ((code === 'Q25' || code === 'Q26') && value?.trim()) {
        results.push({
          type: 'comment',
          data: {
            type: code === 'Q25' ? 'positive' : 'negative',
            content: value.trim(),
            class_name: className || null,
            semester_name: surveyInfo.semester_name,
          },
        });
      }
    }

    return results;
  }


  private findQuestionByCode(responseData: any, targetCode: string): any {
    for (const [, questionData] of Object.entries(responseData)) {
      if (
        questionData &&
        typeof questionData === 'object' &&
        (questionData as any).code === targetCode
      ) {
        return questionData;
      }
    }
    return null;
  }

  private convertPointValue(value: string): number {
    if (!value) return 0;
    switch (value) {
      case 'MH01':
        return 1;
      case 'MH02':
        return 2;
      case 'MH03':
        return 3;
      case 'MH04':
        return 4;
      default:
        return 0;
    }
  }
}
