import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CrawlJob } from './entities/crawl-job.entity';
import { CrawlJobLog } from './entities/crawl-job-log.entity';
import { CrawlApiRequestLog } from './entities/crawl-api-request-log.entity';
import { CrawlStagingDataSummary } from './dtos/crawl-staging-data-summary.dto';
import { CrawlStagingData } from './entities/crawl-staging-data.entity';
import { CrawlJobType } from './enums/crawl-job-type.enum';
import { CrawlDataService } from './services/crawl-data.service';
import {
  SurveyListConfig,
  SurveyListConfigInput,
} from './entities/survey-list-config.entity';
import { SurveyCrawlHistory } from './entities/survey-crawl-history.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../user/decorator/user.decorator';
import GraphQLJSON from 'graphql-type-json';
import { UserEntity } from '../user/entities/user.entity';
import { TopicAssignmentPreview } from './dtos/topic-assignment-preview.dto';
import { TopicAssignmentService } from './services/topic-assignment.service';

@Resolver()
export class CrawlDataResolver {
  constructor(
    private readonly crawlDataService: CrawlDataService,
    private readonly topicAssignmentService: TopicAssignmentService,
  ) {}

  // ========================
  // Queries
  // ========================

  @Query(() => [CrawlJob], {
    description: 'Lấy danh sách các job thu thập dữ liệu',
  })
  async crawlJobs(
    @Args('type', { type: () => CrawlJobType, nullable: true })
    type?: CrawlJobType,
  ): Promise<CrawlJob[]> {
    return this.crawlDataService.getCrawlJobs(type);
  }

  @Query(() => CrawlJob, {
    nullable: true,
    description: 'Lấy thông tin chi tiết một job',
  })
  async crawlJob(@Args('id') id: string): Promise<CrawlJob | null> {
    return this.crawlDataService.getCrawlJob(id);
  }

  @Query(() => [CrawlJobLog], {
    description: 'Lấy danh sách log của một job',
  })
  async crawlJobLogs(
    @Args('jobId') jobId: string,
    @Args('limit', { type: () => Int, defaultValue: 50 }) limit: number,
    @Args('offset', { type: () => Int, defaultValue: 0 }) offset: number,
  ): Promise<CrawlJobLog[]> {
    return this.crawlDataService.getCrawlJobLogs(jobId, limit, offset);
  }

  @Query(() => [CrawlApiRequestLog], {
    description: 'Lấy log chi tiết cuộc gọi API',
  })
  async crawlApiRequestLogs(
    @Args('jobId') jobId: string,
    @Args('limit', { type: () => Int, defaultValue: 50 }) limit: number,
    @Args('offset', { type: () => Int, defaultValue: 0 }) offset: number,
  ): Promise<CrawlApiRequestLog[]> {
    return this.crawlDataService.getCrawlApiRequestLogs(jobId, limit, offset);
  }

  @Query(() => CrawlApiRequestLog, {
    nullable: true,
    description: 'Lấy chi tiết một cuộc gọi API qua ID',
  })
  async crawlApiRequestLog(
    @Args('id') id: string,
  ): Promise<CrawlApiRequestLog | null> {
    return this.crawlDataService.getCrawlApiRequestLog(id);
  }

  @Query(() => CrawlStagingDataSummary, {
    description: 'Thông tin tổng hợp dữ liệu tạm',
  })
  async crawlStagingDataSummary(
    @Args('jobId') jobId: string,
  ): Promise<CrawlStagingDataSummary> {
    return this.crawlDataService.getStagingDataSummary(jobId);
  }

  @Query(() => [CrawlStagingData], {
    description: 'Lấy dữ liệu tạm chi tiết',
  })
  async crawlStagingData(
    @Args('jobId') jobId: string,
    @Args('limit', { type: () => Int, defaultValue: 50 }) limit: number,
    @Args('offset', { type: () => Int, defaultValue: 0 }) offset: number,
    @Args('dataType', { nullable: true }) dataType?: string,
  ): Promise<CrawlStagingData[]> {
    return this.crawlDataService.getCrawlStagingData(
      jobId,
      limit,
      offset,
      dataType,
    );
  }

  @Query(() => [SurveyListConfig], {
    description: 'Lấy danh sách cấu hình khảo sát',
  })
  async surveyListConfigs(
    @Args('type', { type: () => CrawlJobType, nullable: true })
    type?: CrawlJobType,
  ): Promise<SurveyListConfig[]> {
    return this.crawlDataService.getSurveyListConfigs(type);
  }

  @Query(() => [SurveyCrawlHistory], {
    description: 'Lấy lịch sử crawl của các survey config',
  })
  async surveyCrawlHistory(
    @Args('jobId', { nullable: true }) jobId?: string,
    @Args('surveyConfigId', { nullable: true }) surveyConfigId?: string,
    @Args('limit', { type: () => Int, defaultValue: 50 }) limit: number = 50,
    @Args('offset', { type: () => Int, defaultValue: 0 }) offset: number = 0,
  ): Promise<SurveyCrawlHistory[]> {
    return this.crawlDataService.getSurveyCrawlHistory(
      jobId,
      surveyConfigId,
      limit,
      offset,
    );
  }

  @Query(() => GraphQLJSON, {
    description: 'Tìm kiếm danh sách survey từ API của trường',
  })
  @UseGuards(JwtAuthGuard)
  async searchExternalSurveys(
    @Args('keyword', { nullable: true }) keyword?: string,
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number = 1,
    @Args('limit', { type: () => Int, defaultValue: 20 }) limit: number = 20,
    @Args('order', { defaultValue: 'startdate' }) order: string = 'startdate',
    @Args('direction', { defaultValue: 'DESC' }) direction: string = 'DESC',
  ): Promise<any> {
    return this.crawlDataService.getExternalSurveys(
      keyword,
      page,
      limit,
      order,
      direction,
    );
  }

  // ========================
  // Mutations - Run Jobs
  // ========================

  @Mutation(() => CrawlJob, {
    description: 'Chạy thu thập KS Môn học',
  })
  @UseGuards(JwtAuthGuard)
  async runCrawlSubjectSurvey(
    @Args('semester', { nullable: true }) semester?: string,
    @Args('surveyConfigIds', { type: () => [String], nullable: true })
    surveyConfigIds?: string[],
    @CurrentUser() user?: UserEntity,
  ): Promise<CrawlJob> {
    return this.crawlDataService.runCrawl(
      CrawlJobType.SUBJECT_SURVEY,
      { semester, surveyConfigIds },
      user?.username,
    );
  }

  @Mutation(() => CrawlJob, {
    description: 'Chạy thu thập KS Giảng viên',
  })
  @UseGuards(JwtAuthGuard)
  async runCrawlLecturerSurvey(
    @Args('semester', { nullable: true }) semester?: string,
    @Args('surveyConfigIds', { type: () => [String], nullable: true })
    surveyConfigIds?: string[],
    @CurrentUser() user?: UserEntity,
  ): Promise<CrawlJob> {
    return this.crawlDataService.runCrawl(
      CrawlJobType.LECTURER_SURVEY,
      { semester, surveyConfigIds },
      user?.username,
    );
  }

  @Mutation(() => CrawlJob, {
    description: 'Chạy thu thập KS CBNV',
  })
  @UseGuards(JwtAuthGuard)
  async runCrawlStaffSurvey(
    @Args('year', { nullable: true }) year?: string,
    @CurrentUser() user?: UserEntity,
  ): Promise<CrawlJob> {
    return this.crawlDataService.runCrawl(
      CrawlJobType.STAFF_SURVEY,
      year ? { year } : undefined,
      user?.username,
    );
  }

  @Mutation(() => CrawlJob, {
    description: 'Chạy tổng hợp điểm',
  })
  @UseGuards(JwtAuthGuard)
  async runAggregatePoints(
    @CurrentUser() user?: UserEntity,
  ): Promise<CrawlJob> {
    return this.crawlDataService.runCrawl(
      CrawlJobType.AGGREGATE_POINTS,
      undefined,
      user?.username,
    );
  }

  @Mutation(() => CrawlJob, {
    description: 'Chạy chuyển dữ liệu giữa các database',
  })
  @UseGuards(JwtAuthGuard)
  async runTransferData(@CurrentUser() user?: UserEntity): Promise<CrawlJob> {
    return this.crawlDataService.runCrawl(
      CrawlJobType.TRANSFER_DATA,
      undefined,
      user?.username,
    );
  }

  // ========================
  // Mutations - Confirm / Abandon
  // ========================

  @Mutation(() => CrawlJob, {
    description: 'Xác nhận dữ liệu → đưa vào database chính',
  })
  @UseGuards(JwtAuthGuard)
  async confirmCrawlJob(@Args('jobId') jobId: string): Promise<CrawlJob> {
    return this.crawlDataService.confirmJob(jobId);
  }

  @Mutation(() => CrawlJob, {
    description: 'Hủy bỏ dữ liệu tạm',
  })
  @UseGuards(JwtAuthGuard)
  async abandonCrawlJob(@Args('jobId') jobId: string): Promise<CrawlJob> {
    return this.crawlDataService.abandonJob(jobId);
  }

  @Mutation(() => CrawlJob)
  @UseGuards(JwtAuthGuard)
  async stopCrawlJob(@Args('jobId') jobId: string): Promise<CrawlJob> {
    return this.crawlDataService.stopJob(jobId);
  }

  // ========================
  // Mutations - Survey List Config
  // ========================

  @Mutation(() => SurveyListConfig, {
    description: 'Thêm cấu hình khảo sát mới',
  })
  @UseGuards(JwtAuthGuard)
  async addSurveyListConfig(
    @Args('input') input: SurveyListConfigInput,
  ): Promise<SurveyListConfig> {
    return this.crawlDataService.addSurveyListConfig(input);
  }

  @Mutation(() => SurveyListConfig, {
    description: 'Cập nhật cấu hình khảo sát',
  })
  @UseGuards(JwtAuthGuard)
  async updateSurveyListConfig(
    @Args('id') id: string,
    @Args('input') input: SurveyListConfigInput,
  ): Promise<SurveyListConfig> {
    return this.crawlDataService.updateSurveyListConfig(id, input);
  }

  @Mutation(() => Boolean, {
    description: 'Xóa cấu hình khảo sát',
  })
  @UseGuards(JwtAuthGuard)
  async deleteSurveyListConfig(@Args('id') id: string): Promise<boolean> {
    return this.crawlDataService.deleteSurveyListConfig(id);
  }

  // ========================
  // Topic Assignment
  // ========================

  @Mutation(() => CrawlJob, {
    description: 'Chạy phân loại chủ đề cho bình luận',
  })
  @UseGuards(JwtAuthGuard)
  async runTopicAssignment(
    @Args('semesterIds', { type: () => [String], nullable: true })
    semesterIds?: string[],
    @CurrentUser() user?: UserEntity,
  ): Promise<CrawlJob> {
    return this.crawlDataService.runCrawl(
      CrawlJobType.TOPIC_ASSIGNMENT,
      { semesterIds },
      user?.username,
    );
  }

  @Query(() => TopicAssignmentPreview, {
    description: 'Xem trước dữ liệu bình luận trước khi phân loại chủ đề',
  })
  @UseGuards(JwtAuthGuard)
  async topicAssignmentPreview(
    @Args('semesterIds', { type: () => [String], nullable: true })
    semesterIds?: string[],
    @Args('limit', { type: () => Int, defaultValue: 20 }) limit: number = 20,
    @Args('offset', { type: () => Int, defaultValue: 0 }) offset: number = 0,
  ): Promise<TopicAssignmentPreview> {
    return this.topicAssignmentService.getPreview(semesterIds, limit, offset);
  }
}
