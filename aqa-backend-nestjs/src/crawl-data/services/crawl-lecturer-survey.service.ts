import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SurveyApiClient } from './survey-api-client';
import { CrawlStagingData } from '../entities/crawl-staging-data.entity';
import { SurveyListConfig } from '../entities/survey-list-config.entity';
import { CrawlJobType } from '../enums/crawl-job-type.enum';

@Injectable()
export class CrawlLecturerSurveyService {
  private readonly logger = new Logger(CrawlLecturerSurveyService.name);

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
    this.logger.log(`Found ${surveyList.length} lecturer surveys to crawl`);

    let successCount = 0;
    let errorCount = 0;

    for (const surveyInfo of surveyList) {
      try {
        this.logger.log(
          `Processing lecturer survey SID: ${surveyInfo.sid} (${surveyInfo.title})`,
        );

        const surveyData = await this.apiClient.getAllSurveyAnswers(
          surveyInfo.sid,
        );

        for (const responseData of surveyData) {
          const processed = this.processResponse(responseData, surveyInfo);
          for (const item of processed) {
            await this.stagingRepo.save({
              crawl_job_id: crawlJobId,
              data_type: item.type,
              data: item.data,
            });
          }
        }

        successCount++;
        await new Promise((r) => setTimeout(r, 2000));
      } catch (error: any) {
        errorCount++;
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

  private async getSurveyList(semester?: string): Promise<any[]> {
    const query = this.surveyListRepo
      .createQueryBuilder('s')
      .where('s.survey_type = :type', {
        type: CrawlJobType.LECTURER_SURVEY,
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
      const { code, question, value, sub_questions, sub_question_fields, type } = qd;

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
      case 'MH01': return 1;
      case 'MH02': return 2;
      case 'MH03': return 3;
      case 'MH04': return 4;
      case 'MH05': return 4;
      default: return 0;
    }
  }
}
