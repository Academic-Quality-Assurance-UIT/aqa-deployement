import { registerEnumType } from '@nestjs/graphql';

export enum CrawlJobStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CONFIRMED = 'CONFIRMED',
  ABANDONED = 'ABANDONED',
}

registerEnumType(CrawlJobStatus, {
  name: 'CrawlJobStatus',
  description: 'Status of a crawl job',
});
