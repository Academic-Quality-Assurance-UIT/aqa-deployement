import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CrawlJob } from './crawl-job.entity';
import { GraphQLJSON } from 'graphql-type-json';

@ObjectType()
@Entity()
export class CrawlJobLog {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column('uuid')
  crawl_job_id: string;

  @ManyToOne(() => CrawlJob, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'crawl_job_id' })
  crawl_job: CrawlJob;

  @Field()
  @Column({ type: 'varchar' })
  service: string;

  @Field()
  @Column({ type: 'varchar' })
  method: string;

  @Field()
  @Column({ type: 'varchar' })
  endpoint: string;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'integer', nullable: true })
  status_code: number;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'integer', nullable: true })
  duration_ms: number;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  error: string;

  @Field(() => GraphQLJSON, { nullable: true })
  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @Field({ nullable: true })
  @Column({ name: 'api_log_id', type: 'uuid', nullable: true })
  api_log_id: string;

  @Field(() => Date)
  @CreateDateColumn({ type: 'timestamptz' })
  timestamp: Date;
}
