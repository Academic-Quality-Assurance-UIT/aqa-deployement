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
export class CrawlApiRequestLog {
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
  @Column({ type: 'text' })
  request_url: string;

  @Field()
  @Column({ type: 'varchar' })
  request_method: string;

  @Field(() => GraphQLJSON, { nullable: true })
  @Column({ type: 'jsonb', nullable: true })
  request_params: any;

  @Field(() => GraphQLJSON, { nullable: true })
  @Column({ type: 'jsonb', nullable: true })
  request_headers: any;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'integer', nullable: true })
  response_status_code: number;

  @Field(() => GraphQLJSON, { nullable: true })
  @Column({ type: 'jsonb', nullable: true })
  response_body: any;

  @Field(() => GraphQLJSON, { nullable: true })
  @Column({ type: 'jsonb', nullable: true })
  response_headers: any;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'integer', nullable: true })
  duration_ms: number;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  error_message: string;

  @Field(() => Date)
  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}
