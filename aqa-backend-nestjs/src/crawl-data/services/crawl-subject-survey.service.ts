import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SurveyApiClient } from './survey-api-client';
import { CrawlStagingData } from '../entities/crawl-staging-data.entity';
import { SurveyListConfig } from '../entities/survey-list-config.entity';
import { CrawlJobType } from '../enums/crawl-job-type.enum';

@Injectable()
export class CrawlSubjectSurveyService {
  private readonly logger = new Logger(CrawlSubjectSurveyService.name);

  constructor(
    private readonly apiClient: SurveyApiClient,
    @InjectRepository(CrawlStagingData)
    private readonly stagingRepo: Repository<CrawlStagingData>,
    @InjectRepository(SurveyListConfig)
    private readonly surveyListRepo: Repository<SurveyListConfig>,
  ) {}

  async crawl(
    crawlJobId: string,
    semester?: string,
  ): Promise<{ total: number; success: number; failed: number }> {
    const surveyList = await this.getSurveyList(semester);
    this.logger.log(`Found ${surveyList.length} subject surveys to crawl`);

    let successCount = 0;
    let errorCount = 0;
    const errors: any[] = [];

    for (const surveyInfo of surveyList) {
      try {
        this.logger.log(
          `Processing survey: ${surveyInfo.title} (SID: ${surveyInfo.sid})`,
        );

        const surveyData = await this.apiClient.getAllSurveyAnswers(
          surveyInfo.sid,
        );
        const surveyDetailData = await this.apiClient.getAllSurveyDetail(
          surveyInfo.sid,
          { limit: 50 },
        );

        // Process each response and store as staging data
        for (const responseData of surveyData) {
          const processed = this.processResponse(
            responseData,
            surveyInfo,
            surveyDetailData,
          );
          // Save staging data in batches
          for (const item of processed) {
            await this.stagingRepo.save({
              crawl_job_id: crawlJobId,
              data_type: item.type,
              data: item.data,
            });
          }
        }

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
        this.logger.error(`Error crawling SID ${surveyInfo.sid}: ${error.message}`);
      }
    }

    return {
      total: surveyList.length,
      success: successCount,
      failed: errorCount,
    };
  }

  private async getSurveyList(semester?: string): Promise<any[]> {
    const query = this.surveyListRepo
      .createQueryBuilder('s')
      .where('s.survey_type = :type', {
        type: CrawlJobType.SUBJECT_SURVEY,
      })
      .andWhere('s.is_active = true');

    if (semester) {
      query.andWhere('s.semester_name = :semester', { semester });
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
    results.push({
      type: 'semester',
      data: {
        display_name: surveyInfo.semester_name,
        type: surveyInfo.semester_type,
        year: surveyInfo.year,
        search_string: `${surveyInfo.year}, ${surveyInfo.semester_type}`,
      },
    });

    // Extract class
    const classData = this.findQuestionByCode(responseData, 'mamh');
    const className = classData?.value;
    if (className) {
      let program = null;
      if (surveyDetailData?.length > 0) {
        const matchingDetail = surveyDetailData.find(
          (detail: any) => detail.class_name === className,
        );
        if (matchingDetail) program = matchingDetail.program;
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

    // Extract criteria, points, and comments
    for (const [, questionData] of Object.entries(responseData)) {
      if (!questionData || typeof questionData !== 'object') continue;
      const qd = questionData as any;
      const { code, question, value, sub_questions, sub_question_fields, type } = qd;

      if (['nganhhoc', 'tenmh', 'tengv', 'mamh'].includes(code)) continue;

      if (sub_questions && Array.isArray(sub_questions) && type === 'F') {
        for (const subQuestion of sub_questions) {
          results.push({
            type: 'criteria',
            data: {
              display_name: subQuestion.question,
              index: null,
              semester_id: null,
            },
          });

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
      } else if (question && code && !sub_questions) {
        results.push({
          type: 'criteria',
          data: {
            display_name: question,
            index: null,
            semester_id: null,
          },
        });
      }

      // Comments
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
      case 'MH01': return 1;
      case 'MH02': return 2;
      case 'MH03': return 3;
      case 'MH04': return 4;
      default: return 0;
    }
  }
}
