import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import * as https from 'https';

@Injectable()
export class SurveyApiClient {
  private readonly logger = new Logger(SurveyApiClient.name);
  private client: AxiosInstance;

  constructor(private readonly configService: ConfigService) {
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
  ): Promise<any> {
    try {
      const response = await this.client.get('', {
        params: { action: 'getSurveyAnswers', sid, page },
      });
      if (response.data) return response.data;
      throw new Error(`API returned no data for SID: ${sid}, Page: ${page}`);
    } catch (error: any) {
      if (error.response?.status === 429 && retries > 0) {
        const delay = (4 - retries) * 2000;
        this.logger.warn(`Rate limited. Retrying in ${delay}ms...`);
        await new Promise((r) => setTimeout(r, delay));
        return this.getSurveyAnswers(sid, page, retries - 1);
      }
      throw error;
    }
  }

  async getAllSurveyAnswers(sid: string): Promise<any[]> {
    const allData: any[] = [];

    const firstResponse = await this.getSurveyAnswers(sid, 1);
    if (firstResponse.data?.length > 0) {
      allData.push(...firstResponse.data);
    }

    if (firstResponse.meta?.pagination) {
      const { pageCount } = firstResponse.meta.pagination;
      if (pageCount > 1) {
        const batchSize = 5;
        for (let i = 2; i <= pageCount; i += batchSize) {
          const end = Math.min(i + batchSize - 1, pageCount);
          const batchPromises: Promise<any>[] = [];
          for (let p = i; p <= end; p++) {
            batchPromises.push(this.getSurveyAnswers(sid, p));
          }
          const results = await Promise.all(batchPromises);
          for (const res of results) {
            if (res.data?.length > 0) allData.push(...res.data);
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
  ): Promise<any> {
    try {
      const { page = 1, limit = 50 } = options;
      const response = await this.client.get('', {
        params: { action: 'getSurveyDetail', sid, page, limit },
      });
      if (response.data) return response.data;
      throw new Error(`API returned no survey detail data for SID: ${sid}`);
    } catch (error: any) {
      if (error.response?.status === 429 && retries > 0) {
        const delay = (4 - retries) * 2000;
        await new Promise((r) => setTimeout(r, delay));
        return this.getSurveyDetail(sid, options, retries - 1);
      }
      throw error;
    }
  }

  async getAllSurveyDetail(
    sid: string,
    options: { limit?: number } = {},
  ): Promise<any[]> {
    const { limit = 50 } = options;
    const allData: any[] = [];

    const firstResponse = await this.getSurveyDetail(sid, { page: 1, limit });

    const processPageData = (response: any) => {
      if (response.data?.length > 0) {
        const attributes = Object.entries(response.attributes || {});
        const mappedData = response.data.map((item: any) => ({
          id: item.tid,
          class_name:
            item[
              (attributes.find((attr) => attr[1] === 'MaLop') as any)?.[0]
            ],
          program:
            item[
              (attributes.find((attr) => attr[1] === 'Hedt') as any)?.[0]
            ],
        }));
        allData.push(...mappedData);
      }
    };

    processPageData(firstResponse);

    if (firstResponse.meta?.pagination) {
      const { pageCount } = firstResponse.meta.pagination;
      if (pageCount > 1) {
        const batchSize = 5;
        for (let i = 2; i <= pageCount; i += batchSize) {
          const end = Math.min(i + batchSize - 1, pageCount);
          const batchPromises: Promise<any>[] = [];
          for (let p = i; p <= end; p++) {
            batchPromises.push(this.getSurveyDetail(sid, { page: p, limit }));
          }
          const results = await Promise.all(batchPromises);
          for (const res of results) {
            processPageData(res);
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
    return allData;
  }

  // Staff survey specific methods
  async getSurveyResponses(
    sid: string,
    page = 1,
    limit = 10,
    retries = 3,
  ): Promise<any> {
    try {
      const response = await this.client.get('', {
        params: { action: 'getSurveyResponses', sid, page, limit },
      });
      if (response.data) return response.data;
      throw new Error(`No data for SID: ${sid}, Page: ${page}`);
    } catch (error: any) {
      if (error.response?.status === 429 && retries > 0) {
        const delay = (4 - retries) * 2000;
        await new Promise((r) => setTimeout(r, delay));
        return this.getSurveyResponses(sid, page, limit, retries - 1);
      }
      throw error;
    }
  }

  async getSurveyAnswerDetail(
    sid: string,
    id: string,
    retries = 3,
  ): Promise<any> {
    try {
      const response = await this.client.get('', {
        params: { action: 'getSurveyAnswerDetail', sid, id },
      });
      if (response.data) return response.data;
      throw new Error(`No data for SID: ${sid}, ID: ${id}`);
    } catch (error: any) {
      if (error.response?.status === 429 && retries > 0) {
        const delay = (4 - retries) * 2000;
        await new Promise((r) => setTimeout(r, delay));
        return this.getSurveyAnswerDetail(sid, id, retries - 1);
      }
      throw error;
    }
  }
}
