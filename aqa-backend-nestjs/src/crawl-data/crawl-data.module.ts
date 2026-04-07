import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CrawlJob } from './entities/crawl-job.entity';
import { CrawlStagingData } from './entities/crawl-staging-data.entity';
import { SurveyListConfig } from './entities/survey-list-config.entity';
import { CrawlJobLog } from './entities/crawl-job-log.entity';
import { CrawlApiRequestLog } from './entities/crawl-api-request-log.entity';
import { SurveyCrawlHistory } from './entities/survey-crawl-history.entity';
import { Student } from '../student/entities/student.entity';
import { CrawlDataResolver } from './crawl-data.resolver';
import { CrawlDataService } from './services/crawl-data.service';
import { SurveyApiClient } from './services/survey-api-client';
import { CrawlSubjectSurveyService } from './services/crawl-subject-survey.service';
import { CrawlLecturerSurveyService } from './services/crawl-lecturer-survey.service';
import { CrawlStaffSurveyService } from './services/crawl-staff-survey.service';
import { AggregatePointsService } from './services/aggregate-points.service';
import { TransferDataService } from './services/transfer-data.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CrawlJob,
      CrawlJobLog,
      CrawlStagingData,
      SurveyListConfig,
      CrawlApiRequestLog,
      SurveyCrawlHistory,
      Student,
    ]),
    ConfigModule,
  ],
  providers: [
    CrawlDataResolver,
    CrawlDataService,
    SurveyApiClient,
    CrawlSubjectSurveyService,
    CrawlLecturerSurveyService,
    CrawlStaffSurveyService,
    AggregatePointsService,
    TransferDataService,
  ],
  exports: [CrawlDataService],
})
export class CrawlDataModule {}
