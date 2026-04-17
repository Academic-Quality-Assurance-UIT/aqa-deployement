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
    surveyConfigIds?: string[],
  ): Promise<{ total: number; success: number; failed: number }> {
    const surveyList = await this.getSurveyList(year, surveyConfigIds);
    this.logger.log(`Found ${surveyList.length} staff surveys to crawl`);

    let successCount = 0;
    let errorCount = 0;
    let globalTotalData = 0;
    let globalProgress = 0;

    const processedSids = new Set<string>();
    const processedCriteria = new Set<string>();

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
        await this.crawlJobRepo.update(crawlJobId, { last_activity_at: new Date() });

        // Step 1: Fetch question structure
        const questionsResponse = await this.apiClient.getSurveyQuestions(
          surveyInfo.sid,
          3,
          crawlJobId,
        );
        if (!questionsResponse.success || !questionsResponse.data) {
          throw new Error(`Failed to fetch questions for SID: ${surveyInfo.sid}`);
        }
        const questionMapping = this.buildQuestionMapping(questionsResponse.data);

        // Step 1.5: Fetch survey detail to get attribute mapping
        let hocViKey = 'attribute_5';
        let donViKey = 'attribute_6';
        try {
          const detailResponse = await this.apiClient.getSurveyDetail(surveyInfo.sid, { page: 1, limit: 1 }, 3, crawlJobId);
          if (detailResponse?.attributes) {
            const attrMap = detailResponse.attributes;
            hocViKey = Object.keys(attrMap).find(k => attrMap[k] === 'hocvi') || hocViKey;
            donViKey = Object.keys(attrMap).find(k => attrMap[k] === 'donvi') || donViKey;
            this.logger.log(`Mapped attributes for SID ${surveyInfo.sid}: hocvi -> ${hocViKey}, donvi -> ${donViKey}`);
          }
        } catch (e: any) {
          this.logger.warn(`Failed to fetch survey detail for SID ${surveyInfo.sid}, using default attribute mapping: ${e.message}`);
        }

        const attributeMapping = { hocViKey, donViKey };

        // Save Batch to staging if not done
        if (!processedSids.has(surveyInfo.sid)) {
          await this.stagingRepo.save({
            crawl_job_id: crawlJobId,
            data_type: 'staff_survey_batch',
            data: {
              display_name: surveyInfo.sid,
              semester: surveyInfo.year || year,
            },
          });
          processedSids.add(surveyInfo.sid);
        }

        // Save Criteria to staging if not done
        for (const index in questionMapping.groups) {
          const group = questionMapping.groups[index];
          for (const crit of group.criteria) {
            const critKey = `${crit.display_name}:${group.category}`;
            if (!processedCriteria.has(critKey)) {
              await this.stagingRepo.save({
                crawl_job_id: crawlJobId,
                data_type: 'staff_survey_criteria',
                data: {
                  display_name: crit.display_name,
                  category: group.category,
                  index: crit.index,
                  semester: surveyInfo.year || year,
                },
              });
              processedCriteria.add(critKey);
            }
          }
        }

        // Step 2: Fetch first page of responses
        const firstPage = await this.apiClient.getSurveyResponses(
          surveyInfo.sid,
          1,
          50,
          3,
          crawlJobId,
        );

        if (!firstPage.success || !firstPage.data || firstPage.data.length === 0) {
          this.logger.warn(`No responses for SID: ${surveyInfo.sid}`);
          continue;
        }

        const totalItems = firstPage.meta?.pagination?.total || firstPage.data.length;
        const totalPages = firstPage.meta?.pagination?.pageCount || 1;

        globalTotalData += totalItems;
        await this.crawlJobRepo.update(crawlJobId, { total_data: globalTotalData });

        // Helper to process a batch of responses
        const processBatch = async (responses: any[]) => {
          for (const response of responses) {
            const processed = this.processResponse(
              response,
              questionMapping,
              surveyInfo.year || year,
              surveyInfo.sid,
              attributeMapping,
            );
            
            // Save to staging
            for (const item of processed) {
              await this.stagingRepo.save({
                crawl_job_id: crawlJobId,
                data_type: item.type,
                data: item.data,
              });
            }
          }
        };

        // Process first page
        await processBatch(firstPage.data);
        globalProgress += firstPage.data.length;
        await this.crawlJobRepo.update(crawlJobId, { progress: globalProgress });

        // Step 3: Fetch and process remaining pages
        for (let page = 2; page <= totalPages; page++) {
          if (!(await this.isJobRunning(crawlJobId))) break;

          const pageData = await this.apiClient.getSurveyResponses(
            surveyInfo.sid,
            page,
            50,
            3,
            crawlJobId,
          );

          if (pageData.data?.length > 0) {
            await processBatch(pageData.data);
            globalProgress += pageData.data.length;
            await this.crawlJobRepo.update(crawlJobId, { progress: globalProgress });
          }
          await new Promise((r) => setTimeout(r, 300));
        }

        successCount++;
      } catch (error: any) {
        errorCount++;
        this.logger.error(`Error crawling staff survey SID ${surveyInfo.sid}: ${error.message}`);
      }
    }

    return { total: surveyList.length, success: successCount, failed: errorCount };
  }

  private buildQuestionMapping(questions: any[]): any {
    const mapping: any = {
      groups: {},  // keyed by unique ID (group_order:fieldname) to handle duplicate A1/M1 across groups
    };

    const parents = questions.filter(q => q.parent_qid === 0 || q.parent_qid === '0');
    const children = questions.filter(q => q.parent_qid !== 0 && q.parent_qid !== '0');

    // Group parents by group_order so we can pair Ax with Mx within the same group
    const parentsByGroup = new Map<number, any[]>();
    parents.forEach(p => {
      const go = p.group_order ?? 0;
      if (!parentsByGroup.has(go)) parentsByGroup.set(go, []);
      parentsByGroup.get(go)!.push(p);
    });

    // Build child lookup by parent_qid
    const childMap = new Map<string, any[]>();
    children.forEach(c => {
      const pqid = String(c.parent_qid);
      if (!childMap.has(pqid)) childMap.set(pqid, []);
      childMap.get(pqid)!.push(c);
    });

    let groupCounter = 0;
    for (const [groupOrder, groupParents] of parentsByGroup.entries()) {
      // Separate Ax (point) and Mx (comment) parents within this group
      const axParents = groupParents
        .filter(p => {
          const fn = p.fieldname || p.title;
          return fn.startsWith('A') && !isNaN(Number(fn.substring(1)));
        })
        .sort((a, b) => a.question_order - b.question_order);

      const mxParents = groupParents
        .filter(p => {
          const fn = p.fieldname || p.title;
          return fn.startsWith('M') && !isNaN(Number(fn.substring(1)));
        })
        .sort((a, b) => a.question_order - b.question_order);

      // Pair Ax with Mx by position (A1<->M1, A2<->M2, etc. within the same group)
      for (let i = 0; i < axParents.length; i++) {
        const ax = axParents[i];
        const mx = mxParents[i] || null; // Mx might not exist

        const pointQid = ax.qid;
        const commentQid = mx ? mx.qid : null;

        // Get children for point and comment parents
        const pointChildren = (childMap.get(String(pointQid)) || []).sort((a, b) => a.question_order - b.question_order);
        const commentChildren = commentQid
          ? (childMap.get(String(commentQid)) || []).sort((a, b) => a.question_order - b.question_order)
          : [];

        const criteria = pointChildren.map((pc, idx) => {
          const cc = commentChildren[idx] || null;
          return {
            display_name: this.normalizeQuestion(pc.question),
            point_fieldname: pc.fieldname,
            comment_fieldname: cc ? cc.fieldname : null,
          };
        });

        const uniqueKey = `g${groupCounter++}`;
        mapping.groups[uniqueKey] = {
          category: this.normalizeQuestion(ax.question),
          point_qid: pointQid,
          comment_qid: commentQid,
          group_name: ax.group_name,
          criteria,
        };
      }

      // Handle Y1 (in any group)
      const y1 = groupParents.find(p => (p.fieldname || p.title) === 'Y1');
      if (y1) {
        mapping.y1_qid = y1.qid;
      }
    }

    return mapping;
  }

  private processResponse(
    response: any,
    mapping: any,
    year: string,
    sid: string,
    attributeMapping: { hocViKey: string, donViKey: string },
  ): any[] {
    const results: any[] = [];
    const tokenInfo = response.token_info || {};
    const responseId = response.id;

    // 1. Sheet Metadata
    const faculty = tokenInfo[attributeMapping.donViKey] || "N/A";
    const academicDegree = tokenInfo[attributeMapping.hocViKey] || "N/A";
    const displayName = [tokenInfo.lastname, tokenInfo.firstname].filter(Boolean).join(' ').trim() || "N/A";

    // Extract additional comment (Y1) - find a response key ending with X${qid}
    let additionalComment = null;
    if (mapping.y1_qid) {
      const suffix = `X${mapping.y1_qid}`;
      const y1Key = Object.keys(response).find(k => k.endsWith(suffix));
      if (y1Key) {
        additionalComment = response[y1Key] || null;
      }
    }

    results.push({
      type: 'staff_survey_sheet',
      data: {
        sid,
        response_id: responseId,
        working_year: year,
        semester: year, 
        display_name: displayName,
        academic_degree: academicDegree,
        faculty: faculty,
        additional_comment: additionalComment,
      }
    });

    // 2. Points and Comments
    // Response keys have the format: ${SID}X${GID}X${PARENT_QID}${CHILD_FIELDNAME}
    // Since we don't know GID, we search for keys ending with X${PARENT_QID}${CHILD_FIELDNAME}
    const responseKeys = Object.keys(response);

    for (const groupKey in mapping.groups) {
      const group = mapping.groups[groupKey];
      const pointQid = Number(group.point_qid);
      const commentQid = group.comment_qid ? Number(group.comment_qid) : pointQid + 1;

      for (const crit of group.criteria) {
        // Find point value: look for key ending with X${pointQid}${fieldname}
        const pointSuffix = `X${pointQid}${crit.point_fieldname}`;
        const pointKey = responseKeys.find(k => k.endsWith(pointSuffix));
        const pointValue = pointKey ? this.extractPoint(response[pointKey]) : null;

        // Only save if we have a valid point
        if (pointValue === null) continue;

        // Find comment value using paired comment question
        // Comment fieldname is either from mapping (e.g., "A1") or fallback to "A" + point_fieldname
        let commentValue = null;
        const commentFieldname = crit.comment_fieldname || `A${crit.point_fieldname}`;
        const commentSuffix = `X${commentQid}${commentFieldname}`;
        const commentKey = responseKeys.find(k => k.endsWith(commentSuffix));
        if (commentKey) {
          commentValue = response[commentKey] || null;
        }

        results.push({
          type: 'staff_survey_point',
          data: {
            response_id: responseId,
            sid,
            criteria_name: crit.display_name,
            criteria_category: group.category,
            point: pointValue,
            comment: commentValue ? String(commentValue).trim() : null,
            max_point: 5,
          }
        });
      }
    }

    return results;
  }

  private extractPoint(value: any): number | null {
    if (!value) return null;
    if (typeof value === 'number') return value;
    const str = String(value).replace(/^A/, '');
    const num = parseInt(str, 10);
    return isNaN(num) ? null : num;
  }

  private normalizeQuestion(text: string): string {
    if (!text) return '';
    
    // 1. First Pass: Truncate at the first occurrence of suspicious delimiters (scripts/code usually follow these)
    // We look for: \n, \r, double spaces, or start of a tag (<)
    // Also handle escaped versions like \\n and \\r which might come from the API JSON
    const delimiters = ['  ', '\n', '\r', '<', '\\n', '\\r'];
    let minIndex = text.length;
    
    for (const delim of delimiters) {
      const idx = text.indexOf(delim);
      if (idx !== -1 && idx < minIndex) {
        minIndex = idx;
      }
    }
    
    let cleanText = text.substring(0, minIndex);
    
    // 2. Second Pass: Standard cleanup
    return cleanText
      .trim()
      .replace(/^\d+\.\s*/, '') // Remove leading numbers (e.g., "1. ")
      .replace(/:\s*$/, '')     // Remove trailing colon
      .trim();
  }

  private async isJobRunning(jobId: string): Promise<boolean> {
    const job = await this.crawlJobRepo.findOne({
      where: { crawl_job_id: jobId },
      select: ['status'],
    });
    return job?.status === 'RUNNING';
  }

  private async getSurveyList(year?: string, surveyConfigIds?: string[]): Promise<any[]> {
    const query = this.surveyListRepo
      .createQueryBuilder('s')
      .where('s.survey_type = :type', {
        type: CrawlJobType.STAFF_SURVEY,
      })
      .andWhere('s.is_active = true');

    if (year) {
      query.andWhere('s.year = :year', { year });
    }

    if (surveyConfigIds && surveyConfigIds.length > 0) {
      query.andWhere('s.id IN (:...surveyConfigIds)', { surveyConfigIds });
    }
    return query.getMany();
  }
}
