import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import axios, { AxiosInstance } from 'axios';
import * as https from 'https';
import { Repository } from 'typeorm';
import { CrawlJob } from '../entities/crawl-job.entity';
import { CrawlJobLog } from '../entities/crawl-job-log.entity';
import { CrawlApiRequestLog } from '../entities/crawl-api-request-log.entity';

@Injectable()
export class SurveyApiClient {
  private readonly logger = new Logger(SurveyApiClient.name);
  private client: AxiosInstance;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(CrawlJob)
    private readonly crawlJobRepo: Repository<CrawlJob>,
    @InjectRepository(CrawlJobLog)
    private readonly crawlJobLogRepo: Repository<CrawlJobLog>,
    @InjectRepository(CrawlApiRequestLog)
    private readonly apiRequestLogRepo: Repository<CrawlApiRequestLog>,
  ) {
    const baseURL =
      this.configService.get<string>('SURVEY_API_BASE_URL') ||
      'https://survey.uit.edu.vn/api/survey_api.php';
    const token =
      this.configService.get<string>('SURVEY_API_TOKEN') ||
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30';

    this.client = axios.create({
      baseURL,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
      timeout: 30000,
    });
  }

  async getSurveyAnswers(
    sid: string,
    page = 1,
    retries = 3,
    jobId?: string,
  ): Promise<any> {
    const startTime = Date.now();
    const action = 'getSurveyAnswers';
    const params = { sid, page };

    try {
      const response = await this.client.get('', {
        params: { action, ...params },
      });

      if (jobId) {
        await this.logActivity(jobId, response, Date.now() - startTime);
      }

      if (response.data) return response.data;
      throw new Error(`API returned no data for SID: ${sid}, Page: ${page}`);
    } catch (error: any) {
      if (jobId) {
        await this.logActivity(jobId, null, Date.now() - startTime, error);
      }

      if (error.response?.status === 429 && retries > 0) {
        const delay = (4 - retries) * 2000;
        this.logger.warn(`Rate limited. Retrying in ${delay}ms...`);
        await new Promise((r) => setTimeout(r, delay));
        return this.getSurveyAnswers(sid, page, retries - 1, jobId);
      }
      throw error;
    }
  }

  async getAllSurveyAnswers(
    sid: string,
    jobId?: string,
    onProgress?: (
      fetchedCount: number,
      totalCount: number,
      batchData?: any[],
    ) => Promise<void>,
  ): Promise<any[]> {
    const allData: any[] = [];

    const firstResponse = await this.getSurveyAnswers(sid, 1, 3, jobId);
    if (firstResponse.data?.length > 0) {
      allData.push(...firstResponse.data);
    }

    let totalItems = Number(firstResponse.meta?.pagination?.total || 0);
    if (totalItems === 0) totalItems = allData.length;

    if (onProgress && firstResponse.data?.length > 0) {
      await onProgress(allData.length, totalItems, firstResponse.data);
    } else if (onProgress) {
      await onProgress(allData.length, totalItems, []);
    }

    if (firstResponse.meta?.pagination) {
      const pageCount = Number(firstResponse.meta.pagination.pageCount);
      if (pageCount > 1) {
        const batchSize = 5;
        for (let i = 2; i <= pageCount; i += batchSize) {
          const end = Math.min(i + batchSize - 1, pageCount);
          const batchPromises: Promise<any>[] = [];
          for (let p = i; p <= end; p++) {
            batchPromises.push(this.getSurveyAnswers(sid, p, 3, jobId));
          }
          const results = await Promise.all(batchPromises);
          let newBatchData: any[] = [];
          for (const res of results) {
            if (res.data?.length > 0) {
                allData.push(...res.data);
                newBatchData.push(...res.data);
            }
          }
          if (onProgress) {
            await onProgress(allData.length, totalItems, newBatchData);
          }
          if (end < pageCount) {
            await new Promise((r) => setTimeout(r, 500));
          }
        }
      }
    }

    this.logger.log(`Fetched ${allData.length} total records for SID: ${sid}`);
    return allData;
  }

  async getSurveyDetail(
    sid: string,
    options: { page?: number; limit?: number } = {},
    retries = 3,
    jobId?: string,
  ): Promise<any> {
    const startTime = Date.now();
    const action = 'getSurveyDetail';
    const params = { sid, ...options };

    try {
      const { page = 1, limit = 50 } = options;
      const response = await this.client.get('', {
        params: { action, sid, page, limit },
      });

      if (jobId) {
        await this.logActivity(jobId, response, Date.now() - startTime);
      }

      if (response.data) return response.data;
      throw new Error(`API returned no survey detail data for SID: ${sid}`);
    } catch (error: any) {
      if (jobId) {
        await this.logActivity(jobId, null, Date.now() - startTime, error);
      }

      if (error.response?.status === 429 && retries > 0) {
        const delay = (4 - retries) * 2000;
        await new Promise((r) => setTimeout(r, delay));
        return this.getSurveyDetail(sid, options, retries - 1, jobId);
      }
      throw error;
    }
  }

  async getAllSurveyDetail(
    sid: string,
    options: { limit?: number } = {},
    jobId?: string,
    onProgress?: (fetchedCount: number, totalCount: number) => Promise<void>,
  ): Promise<{ data: any[]; attributes: any }> {
    const { limit = 50 } = options;
    const allData: any[] = [];
    let attributesMap: any = {};

    const firstResponse = await this.getSurveyDetail(
      sid,
      { page: 1, limit },
      3,
      jobId,
    );

    const processPageData = (response: any) => {
      if (response.data?.length > 0) {
        allData.push(...response.data);
      }
      if (response.attributes) {
        attributesMap = response.attributes;
      }
    };

    processPageData(firstResponse);

    let totalItems = Number(firstResponse.meta?.pagination?.total || 0);
    if (totalItems === 0) totalItems = allData.length;

    if (onProgress) {
      await onProgress(allData.length, totalItems);
    }

    if (firstResponse.meta?.pagination) {
      const pageCount = Number(firstResponse.meta.pagination.pageCount);
      if (pageCount > 1) {
        const batchSize = 5;
        for (let i = 2; i <= pageCount; i += batchSize) {
          const end = Math.min(i + batchSize - 1, pageCount);
          const batchPromises: Promise<any>[] = [];
          for (let p = i; p <= end; p++) {
            batchPromises.push(
              this.getSurveyDetail(sid, { page: p, limit }, 3, jobId),
            );
          }
          const results = await Promise.all(batchPromises);
          for (const res of results) {
            processPageData(res);
          }
          if (onProgress) {
            await onProgress(allData.length, totalItems);
          }
          if (end < pageCount) {
            await new Promise((r) => setTimeout(r, 500));
          }
        }
      }
    }

    this.logger.log(
      `Fetched ${allData.length} survey detail records for SID: ${sid}`,
    );
    return { data: allData, attributes: attributesMap };
  }

  // Staff survey specific methods
  async getSurveyResponses(
    sid: string,
    page = 1,
    limit = 10,
    retries = 3,
    jobId?: string,
  ): Promise<any> {
    const startTime = Date.now();
    const action = 'getSurveyResponses';
    const params = { sid, page, limit };

    try {
      const response = await this.client.get('', {
        params: { action, ...params },
      });

      if (jobId) {
        await this.logActivity(jobId, response, Date.now() - startTime);
      }

      if (response.data) return response.data;
      throw new Error(`No data for SID: ${sid}, Page: ${page}`);
    } catch (error: any) {
      if (jobId) {
        await this.logActivity(jobId, null, Date.now() - startTime, error);
      }

      if (error.response?.status === 429 && retries > 0) {
        const delay = (4 - retries) * 2000;
        await new Promise((r) => setTimeout(r, delay));
        return this.getSurveyResponses(sid, page, limit, retries - 1, jobId);
      }
      throw error;
    }
  }

  async getSurveyAnswerDetail(
    sid: string,
    id: string,
    retries = 3,
    jobId?: string,
  ): Promise<any> {
    const startTime = Date.now();
    const action = 'getSurveyAnswerDetail';
    const params = { sid, id };

    try {
      const response = await this.client.get('', {
        params: { action, ...params },
      });

      if (jobId) {
        await this.logActivity(jobId, response, Date.now() - startTime);
      }

      if (response.data) return response.data;
      throw new Error(`No data for SID: ${sid}, ID: ${id}`);
    } catch (error: any) {
      if (jobId) {
        await this.logActivity(jobId, null, Date.now() - startTime, error);
      }

      if (error.response?.status === 429 && retries > 0) {
        const delay = (4 - retries) * 2000;
        await new Promise((r) => setTimeout(r, delay));
        return this.getSurveyAnswerDetail(sid, id, retries - 1, jobId);
      }
      throw error;
    }
  }

  async getExternalSurveys(
    options: { keyword?: string; page?: number; limit?: number; order?: string; direction?: string } = {},
  ): Promise<any> {
    const action = 'getSurveys';
    const params = {
      action,
      page: options.page || 1,
      limit: options.limit || 20,
      order: options.order || 'startdate',
      direction: options.direction || 'DESC',
      title: options.keyword || undefined,
    };

    try {
      const response = await this.client.get('', { params });
      if (response.data) return response.data;
      throw new Error('API returned no survey list data');
    } catch (error) {
      this.logger.error('Failed to fetch external survey list:', error);
      throw error;
    }
  }

  private async logActivity(
    jobId: string,
    response: any,
    durationMs?: number,
    error?: any,
  ) {
    try {
      const config = response?.config || error?.config;
      const fullUrl = config ? this.client.getUri(config) : 'Unknown';
      const method = config?.method?.toUpperCase() || 'GET';
      const statusCode = response?.status || error?.response?.status;
      const responseData = response?.data;
      const errorMessage = error?.message;

      // Extract endpoint/action from params if possible
      const action = config?.params?.action || 'Unknown';

      // Create detailed API request log with response body
      const apiLog = await this.apiRequestLogRepo.save({
        crawl_job_id: jobId,
        request_url: fullUrl,
        request_method: method,
        request_params: config?.params,
        request_headers: config?.headers,
        response_status_code: statusCode,
        response_body: responseData,
        response_headers: response?.headers,
        duration_ms: durationMs,
        error_message: errorMessage,
      });

      // Create standard job log without heavy response payload
      await this.crawlJobLogRepo.save({
        crawl_job_id: jobId,
        service: 'SurveyAPI',
        method,
        endpoint: action,
        status_code: statusCode,
        duration_ms: durationMs,
        error: errorMessage,
        api_log_id: apiLog.id, // Link to detailed log
        metadata: {
          url: fullUrl,
          baseUrl: config?.baseURL,
          params: config?.params,
          // Removed responseData to prevent memory bloat in frontend polling
        },
      });

      // Update job activity
      await this.crawlJobRepo.update(jobId, {
        last_activity_at: new Date(),
      });
    } catch (error) {
      this.logger.error(`Failed to log activity for job ${jobId}:`, error);
    }
  }
}
