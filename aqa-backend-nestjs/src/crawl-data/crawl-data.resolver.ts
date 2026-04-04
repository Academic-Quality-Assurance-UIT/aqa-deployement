import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CrawlJob } from './entities/crawl-job.entity';
import { CrawlStagingDataSummary } from './dtos/crawl-staging-data-summary.dto';
import { CrawlJobType } from './enums/crawl-job-type.enum';
import { CrawlDataService } from './services/crawl-data.service';
import { SurveyListConfig, SurveyListConfigInput } from './entities/survey-list-config.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../user/decorator/user.decorator';
import { UserEntity } from '../user/entities/user.entity';

@Resolver()
export class CrawlDataResolver {
  constructor(private readonly crawlDataService: CrawlDataService) {}

  // ========================
  // Queries
  // ========================

  @Query(() => [CrawlJob], { description: 'Lấy danh sách các job thu thập dữ liệu' })
  async crawlJobs(
    @Args('type', { type: () => CrawlJobType, nullable: true })
    type?: CrawlJobType,
  ): Promise<CrawlJob[]> {
    return this.crawlDataService.getCrawlJobs(type);
  }

  @Query(() => CrawlJob, { nullable: true, description: 'Lấy thông tin chi tiết một job' })
  async crawlJob(
    @Args('id') id: string,
  ): Promise<CrawlJob | null> {
    return this.crawlDataService.getCrawlJob(id);
  }

  @Query(() => CrawlStagingDataSummary, {
    description: 'Thông tin tổng hợp dữ liệu tạm',
  })
  async crawlStagingDataSummary(
    @Args('jobId') jobId: string,
  ): Promise<CrawlStagingDataSummary> {
    return this.crawlDataService.getStagingDataSummary(jobId);
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

  // ========================
  // Mutations - Run Jobs
  // ========================

  @Mutation(() => CrawlJob, {
    description: 'Chạy thu thập KS Môn học',
  })
  @UseGuards(JwtAuthGuard)
  async runCrawlSubjectSurvey(
    @Args('semester', { nullable: true }) semester?: string,
    @CurrentUser() user?: UserEntity,
  ): Promise<CrawlJob> {
    return this.crawlDataService.runCrawl(
      CrawlJobType.SUBJECT_SURVEY,
      semester ? { semester } : undefined,
      user?.username,
    );
  }

  @Mutation(() => CrawlJob, {
    description: 'Chạy thu thập KS Giảng viên',
  })
  @UseGuards(JwtAuthGuard)
  async runCrawlLecturerSurvey(
    @Args('semester', { nullable: true }) semester?: string,
    @CurrentUser() user?: UserEntity,
  ): Promise<CrawlJob> {
    return this.crawlDataService.runCrawl(
      CrawlJobType.LECTURER_SURVEY,
      semester ? { semester } : undefined,
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
  async runTransferData(
    @CurrentUser() user?: UserEntity,
  ): Promise<CrawlJob> {
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
}
