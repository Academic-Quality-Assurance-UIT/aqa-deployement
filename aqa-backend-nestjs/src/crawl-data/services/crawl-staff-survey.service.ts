import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SurveyApiClient } from './survey-api-client';
import { CrawlJob } from '../entities/crawl-job.entity';
import { CrawlStagingData } from '../entities/crawl-staging-data.entity';
import { SurveyListConfig } from '../entities/survey-list-config.entity';
import { CrawlJobType } from '../enums/crawl-job-type.enum';

@Injectable()
export class CrawlStaffSurveyService {
  private readonly logger = new Logger(CrawlStaffSurveyService.name);

  constructor(
    private readonly apiClient: SurveyApiClient,
    @InjectRepository(CrawlJob)
    private readonly crawlJobRepo: Repository<CrawlJob>,
    @InjectRepository(CrawlStagingData)
    private readonly stagingRepo: Repository<CrawlStagingData>,
    @InjectRepository(SurveyListConfig)
    private readonly surveyListRepo: Repository<SurveyListConfig>,
  ) {}

  async crawl(
    crawlJobId: string,
    year?: string,
  ): Promise<{ total: number; success: number; failed: number }> {
    const surveyList = await this.getSurveyList(year);
    this.logger.log(`Found ${surveyList.length} staff surveys to crawl`);

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
        this.logger.log(`Processing staff survey SID: ${surveyInfo.sid}`);

        // Step 1: Fetch first page
        const firstPage = await this.apiClient.getSurveyResponses(
          surveyInfo.sid,
          1,
          10,
          3,
          crawlJobId,
        );
        if (
          !firstPage.success ||
          !firstPage.data ||
          firstPage.data.length === 0
        ) {
          this.logger.warn(`No responses for SID: ${surveyInfo.sid}`);
          continue;
        }

        const sampleId = firstPage.data[0].id;
        const totalPages = firstPage.meta?.pagination?.pageCount || 1;
        const totalItems = firstPage.meta?.pagination?.total || 0;

        globalTotalData += totalItems;
        await this.crawlJobRepo.update(crawlJobId, {
          total_data: globalTotalData,
        });

        // Step 2: Fetch question list
        const questionListResponse = await this.apiClient.getSurveyAnswerDetail(
          surveyInfo.sid,
          sampleId,
          3,
          crawlJobId,
        );
        if (!questionListResponse.success || !questionListResponse.data) {
          throw new Error(
            `Failed to fetch question list for SID: ${surveyInfo.sid}`,
          );
        }
        const questionInfo = this.processQuestionList(
          questionListResponse.data,
        );

        // Step 3: Process first page
        for (const responseData of firstPage.data) {
          const processed = this.processResponse(
            responseData,
            questionInfo,
            surveyInfo.year || year,
            surveyInfo.sid,
          );
          for (const item of processed) {
            await this.stagingRepo.save({
              crawl_job_id: crawlJobId,
              data_type: item.type,
              data: item.data,
            });
          }
        }

        globalProgress += firstPage.data.length;
        await this.crawlJobRepo.update(crawlJobId, {
          progress: globalProgress,
        });

        // Step 4: Process remaining pages
        for (let page = 2; page <= totalPages; page++) {
          const pageData = await this.apiClient.getSurveyResponses(
            surveyInfo.sid,
            page,
            10,
            3,
            crawlJobId,
          );
          if (pageData.data?.length > 0) {
            for (const responseData of pageData.data) {
              const processed = this.processResponse(
                responseData,
                questionInfo,
                surveyInfo.year || year,
                surveyInfo.sid,
              );
              for (const item of processed) {
                await this.stagingRepo.save({
                  crawl_job_id: crawlJobId,
                  data_type: item.type,
                  data: item.data,
                });
              }
            }
            globalProgress += pageData.data.length;
            await this.crawlJobRepo.update(crawlJobId, {
              progress: globalProgress,
            });
          }
          if (page < totalPages) {
            await new Promise((r) => setTimeout(r, 500));
          }
        }

        successCount++;
        await new Promise((r) => setTimeout(r, 2000));
      } catch (error: any) {
        errorCount++;
        this.logger.error(
          `Error crawling staff survey SID ${surveyInfo.sid}: ${error.message}`,
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

  private async getSurveyList(year?: string): Promise<any[]> {
    const query = this.surveyListRepo
      .createQueryBuilder('s')
      .where('s.survey_type = :type', {
        type: CrawlJobType.STAFF_SURVEY,
      })
      .andWhere('s.is_active = true');

    if (year) {
      query.andWhere('s.year = :year', { year });
    }

    return query.getMany();
  }

  private normalizeQuestion(text: string): string {
    if (!text) return '';
    return text
      .trim()
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/\\r/g, '')
      .replace(/\\n/g, '')
      .replace(/\r/g, '')
      .replace(/\n/g, '')
      .replace(/\t/g, '')
      .replace(/^\d+\.\s*/, '')
      .replace(/:\s*$/, '')
      .trim();
  }

  private processQuestionList(questionData: any): any {
    const parentQuestions: Record<string, any> = {};
    const subQuestionsByParent: Record<string, any[]> = {};
    const knownParentQids = new Set<string>();
    const parentQidToFullKey: Record<string, string> = {};

    for (const [fullKey, q] of Object.entries(questionData)) {
      const qObj = q as any;
      const normalized = this.normalizeQuestion(qObj.question);

      if (qObj.parent_qid === '0') {
        parentQuestions[fullKey] = {
          qid: qObj.qid,
          question: normalized,
          code: qObj.code,
          type: qObj.type,
          groupName: qObj.group_name,
        };
        knownParentQids.add(qObj.qid);
        parentQidToFullKey[qObj.qid] = fullKey;
      } else {
        if (!subQuestionsByParent[qObj.parent_qid]) {
          subQuestionsByParent[qObj.parent_qid] = [];
        }
        subQuestionsByParent[qObj.parent_qid].push({
          qid: qObj.qid,
          code: qObj.code,
          question: normalized,
          type: qObj.type,
        });
      }
    }

    for (const parentQid of Object.keys(subQuestionsByParent)) {
      subQuestionsByParent[parentQid].sort((a, b) => {
        const aNum = parseInt(a.code.replace(/^A/, ''), 10);
        const bNum = parseInt(b.code.replace(/^A/, ''), 10);
        if (!isNaN(aNum) && !isNaN(bNum)) return aNum - bNum;
        return a.code.localeCompare(b.code);
      });
    }

    return {
      parentQuestions,
      subQuestionsByParent,
      knownParentQids,
      parentQidToFullKey,
    };
  }

  private parseLastPart(
    lastPart: string,
    knownParentQids: Set<string>,
  ): { parentQid: string; suffix: string } | null {
    const aMatch = lastPart.match(/^(\d+)(A\d+)$/);
    if (aMatch && knownParentQids.has(aMatch[1])) {
      return { parentQid: aMatch[1], suffix: aMatch[2] };
    }

    const sortedQids = [...knownParentQids].sort((a, b) => b.length - a.length);
    for (const qid of sortedQids) {
      if (lastPart === qid) return { parentQid: qid, suffix: '' };
      if (lastPart.startsWith(qid) && lastPart.length > qid.length) {
        return { parentQid: qid, suffix: lastPart.substring(qid.length) };
      }
    }
    return null;
  }

  private extractPoint(value: any): number | null {
    if (!value || typeof value !== 'string') return null;
    const cleaned = value.replace(/^A/, '');
    const num = parseInt(cleaned, 10);
    return isNaN(num) ? null : num;
  }

  private getSuffixOrder(suffix: string): number {
    const cleaned = suffix.replace(/^A/, '');
    return parseInt(cleaned, 10);
  }

  private processResponse(
    responseData: any,
    questionInfo: any,
    year: string,
    sid: string,
  ): Array<{ type: string; data: any }> {
    const results: Array<{ type: string; data: any }> = [];
    const METADATA_KEYS = new Set([
      'id',
      'token',
      'submitdate',
      'lastpage',
      'startlanguage',
      'startdate',
      'datestamp',
      'token_info',
    ]);

    const tokenInfo = responseData.token_info;
    if (!tokenInfo) return results;

    const allGroups: any[] = [];
    let currentPointGroup: any = null;

    const answerKeys = Object.keys(responseData).filter(
      (k) => !METADATA_KEYS.has(k),
    );

    for (const key of answerKeys) {
      const value = responseData[key];
      const parts = key.split('X');
      if (parts.length !== 3) continue;

      const lastPart = parts[2];
      const parsed = this.parseLastPart(lastPart, questionInfo.knownParentQids);
      if (!parsed) continue;

      const { parentQid, suffix } = parsed;
      const parentFullKey = `${parts[0]}X${parts[1]}X${parentQid}`;
      const parentQuestion = questionInfo.parentQuestions[parentFullKey];
      if (!parentQuestion) continue;

      if (suffix === '') {
        if (currentPointGroup) {
          allGroups.push(currentPointGroup);
          currentPointGroup = null;
        }

        const category = parentQuestion.groupName || parentQuestion.question;
        const displayName = parentQuestion.question;

        allGroups.push({
          category,
          pointParentQid: parentQid,
          isStandalone: true,
          type: parentQuestion.type,
          points: [
            {
              displayName,
              index: 1,
              pointValue: this.extractPoint(value),
              comment:
                typeof value === 'string' && !/^A\d+$/.test(value)
                  ? value
                  : null,
              raw_value: value,
            },
          ],
        });
        continue;
      }

      if (parentQuestion.type === 'F') {
        if (
          !currentPointGroup ||
          currentPointGroup.pointParentQid !== parentQid
        ) {
          if (currentPointGroup) allGroups.push(currentPointGroup);

          const subQuestions =
            questionInfo.subQuestionsByParent[parentQid] || [];

          currentPointGroup = {
            category: parentQuestion.question,
            pointParentQid: parentQid,
            subQuestions,
            isStandalone: false,
            type: parentQuestion.type,
            points: [],
          };
        }

        const subQuestion = currentPointGroup.subQuestions.find(
          (sq: any) => sq.code === suffix,
        );
        const displayName = subQuestion
          ? subQuestion.question
          : `Question ${suffix}`;
        const pointIndex = currentPointGroup.points.length + 1;
        const pointValue = this.extractPoint(value);

        currentPointGroup.points.push({
          displayName,
          index: pointIndex,
          pointValue,
          comment: null,
          raw_value: value,
        });
      } else if (parentQuestion.type === 'Q') {
        if (!currentPointGroup) continue;
        const suffixOrder = this.getSuffixOrder(suffix);
        const commentIndex = suffixOrder - 1;
        if (
          commentIndex >= 0 &&
          commentIndex < currentPointGroup.points.length
        ) {
          currentPointGroup.points[commentIndex].comment =
            value?.trim() || null;
        }
      }
    }

    if (currentPointGroup) allGroups.push(currentPointGroup);

    // Store as staging data
    results.push({
      type: 'staff_survey_response',
      data: {
        sid,
        year,
        response_id: responseData.id,
        token_info: tokenInfo,
        groups: allGroups,
      },
    });

    // Extract text data
    for (const group of allGroups) {
      for (const point of group.points) {
        const textValue = point.comment || point.raw_value;
        let isText = false;

        if (group.type === 'T') isText = true;
        else if (point.comment) isText = true;
        else if (group.category?.toUpperCase().includes('ĐƠN VỊ'))
          isText = true;

        if (
          isText &&
          textValue &&
          typeof textValue === 'string' &&
          textValue.trim()
        ) {
          const trimmed = textValue.trim();
          const isCode = /^A\d+$/.test(trimmed);
          const isNumber = !isNaN(Number(trimmed));

          if (point.comment || (!isCode && !isNumber)) {
            results.push({
              type: 'staff_survey_text',
              data: {
                sid,
                year,
                unit: group.category,
                question: point.displayName,
                answer: trimmed,
              },
            });
          }
        }
      }
    }

    return results;
  }
}
