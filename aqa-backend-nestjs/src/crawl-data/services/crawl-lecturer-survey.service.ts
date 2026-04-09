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
export class CrawlLecturerSurveyService {
  private readonly logger = new Logger(CrawlLecturerSurveyService.name);

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
    this.logger.log(`Found ${surveyList.length} lecturer surveys to crawl`);

    let successCount = 0;
    let errorCount = 0;

    let globalTotalData = 0;
    let globalProgress = 0;

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
          `Processing lecturer survey SID: ${surveyInfo.sid} (${surveyInfo.title})`,
        );

        let currentAnswersTotal = 0;
        let currentAnswersFetched = 0;

        const historyRecord = await this.surveyCrawlHistoryRepo.save({
          survey_list_config_id: surveyInfo.id,
          crawl_job_id: crawlJobId,
          sid: surveyInfo.sid,
          status: 'RUNNING',
          records_fetched: 0,
          started_at: new Date(),
        });
        const surveyData = await this.apiClient.getAllSurveyAnswers(
          surveyInfo.sid,
          crawlJobId,
          async (fetched, total, batchData) => {
            currentAnswersTotal = total;
            currentAnswersFetched = fetched;

            if (batchData && batchData.length > 0) {
              for (const responseData of batchData) {
                const processed = this.processResponse(
                  responseData,
                  surveyInfo,
                );
                const valuesToInsert = processed.map((item) => {
                  let key = item.data?.display_name || uuidv4();
                  if (
                    item.type === 'staff_survey_point' ||
                    item.type === 'staff_survey_comment' ||
                    item.type === 'staff_survey_sheet'
                  ) {
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
                    .orIgnore() // Skips duplicates based on unique constraint
                    .execute();
                }
              }
            }

            await this.crawlJobRepo.update(crawlJobId, {
              progress: globalProgress + fetched,
              total_data: globalTotalData + currentAnswersTotal,
            });
          },
        );
        globalProgress += currentAnswersFetched;
        globalTotalData += currentAnswersTotal;

        // Update SurveyListConfig
        await this.surveyListRepo.update(surveyInfo.id, {
          last_crawled_at: new Date(),
        });

        // Update History
        await this.surveyCrawlHistoryRepo.update(historyRecord.id, {
          status: 'SUCCESS',
          records_fetched: currentAnswersTotal,
          completed_at: new Date(),
        });

        successCount++;
        await new Promise((r) => setTimeout(r, 2000));
      } catch (error: any) {
        errorCount++;

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
          `Error crawling lecturer survey SID ${surveyInfo.sid}: ${error.message}`,
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

  private async getSurveyList(
    semester?: string,
    surveyConfigIds?: string[],
  ): Promise<any[]> {
    const query = this.surveyListRepo
      .createQueryBuilder('s')
      .where('s.survey_type = :type', {
        type: CrawlJobType.LECTURER_SURVEY,
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
  ): Array<{ type: string; data: any }> {
    const results: Array<{ type: string; data: any }> = [];

    // Store staff_survey_batch
    results.push({
      type: 'staff_survey_batch',
      data: {
        display_name: surveyInfo.year,
        semester: surveyInfo.semester_name || null,
      },
    });

    // Extract working year
    const workingYearData = this.findQuestionByCode(responseData, 'MHthem');

    // Store staff_survey_sheet
    results.push({
      type: 'staff_survey_sheet',
      data: {
        working_year: workingYearData?.value || null,
        batch_name: surveyInfo.year,
      },
    });

    // Process criteria, points, and comments
    for (const [, questionData] of Object.entries(responseData)) {
      if (!questionData || typeof questionData !== 'object') continue;
      const qd = questionData as any;
      const {
        code,
        question,
        value,
        sub_questions,
        sub_question_fields,
        type,
      } = qd;

      if (['nganhhoc', 'tenmh', 'tengv', 'mamh', 'MHthem'].includes(code))
        continue;

      if (sub_questions && Array.isArray(sub_questions) && type === 'F') {
        for (let i = 0; i < sub_questions.length; i++) {
          const subQuestion = sub_questions[i];

          results.push({
            type: 'staff_survey_criteria',
            data: {
              display_name: subQuestion.question,
              category: qd.group_name,
            },
          });

          if (sub_question_fields?.[subQuestion.title]) {
            const pointValue = this.convertPointValue(
              sub_question_fields[subQuestion.title],
            );
            if (pointValue > 0) {
              const maxPoint = value?.[subQuestion.title]
                ? Object.keys(value[subQuestion.title]).length
                : 4;

              results.push({
                type: 'staff_survey_point',
                data: {
                  max_point: maxPoint,
                  point: pointValue,
                  comment: null,
                  criteria_name: subQuestion.question,
                  criteria_category: qd.group_name,
                },
              });
            }
          }
        }
      }

      // Text type (T) questions
      if (type === 'T' && question) {
        results.push({
          type: 'staff_survey_criteria',
          data: {
            display_name: question,
            category: qd.group_name,
          },
        });

        results.push({
          type: 'staff_survey_point',
          data: {
            max_point: 0,
            point: 0,
            comment: value,
            criteria_name: question,
            criteria_category: qd.group_name,
          },
        });
      }

      // Comment type (Q) - merge comments into preceding points
      if (type === 'Q' && value) {
        const comments = Object.values(value);
        for (let idx = 0; idx < comments.length; idx++) {
          const commentValue = comments[idx] as string;
          if (commentValue?.trim()) {
            results.push({
              type: 'staff_survey_comment',
              data: {
                comment: commentValue.trim(),
                code,
                index: idx,
              },
            });
          }
        }
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
      case 'MH05':
        return 4;
      default:
        return 0;
    }
  }
}
