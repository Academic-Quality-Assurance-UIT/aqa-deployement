import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';
import { CrawlJobType } from '../enums/crawl-job-type.enum';
import { CrawlJobStatus } from '../enums/crawl-job-status.enum';
import { GraphQLJSON } from 'graphql-type-json';

@ObjectType()
@Entity()
export class CrawlJob {
  @Field()
  @PrimaryColumn('uuid', { default: () => 'uuid_generate_v4()' })
  crawl_job_id: string;

  @Field(() => CrawlJobType)
  @Column({ type: 'varchar' })
  type: CrawlJobType;

  @Field(() => CrawlJobStatus)
  @Column({ type: 'varchar', default: CrawlJobStatus.PENDING })
  status: CrawlJobStatus;

  @Field(() => Date, { nullable: true })
  @Column({ type: 'timestamptz', nullable: true })
  started_at: Date;

  @Field(() => Date, { nullable: true })
  @Column({ type: 'timestamptz', nullable: true })
  completed_at: Date;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  error_message: string;

  @Field(() => GraphQLJSON, { nullable: true })
  @Column({ type: 'jsonb', nullable: true })
  summary: any;

  @Field(() => GraphQLJSON, { nullable: true })
  @Column({ type: 'jsonb', nullable: true })
  parameters: any;

  @Field({ nullable: true })
  @Column({ type: 'varchar', nullable: true })
  created_by: string;

  @Field(() => Date)
  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'integer', default: 0 })
  progress: number;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'integer', default: 0 })
  total_data: number;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'integer', default: 0 })
  detail_progress: number;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'integer', default: 0 })
  detail_total: number;

  @Field(() => Date, { nullable: true })
  @Column({ type: 'timestamptz', nullable: true })
  last_activity_at: Date;
}
