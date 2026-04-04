import { registerEnumType } from '@nestjs/graphql';

export enum CrawlJobType {
  SUBJECT_SURVEY = 'SUBJECT_SURVEY',
  LECTURER_SURVEY = 'LECTURER_SURVEY',
  STAFF_SURVEY = 'STAFF_SURVEY',
  AGGREGATE_POINTS = 'AGGREGATE_POINTS',
  TRANSFER_DATA = 'TRANSFER_DATA',
}

registerEnumType(CrawlJobType, {
  name: 'CrawlJobType',
  description: 'Type of crawl job',
});
