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
import { SurveyListConfig } from './survey-list-config.entity';

@ObjectType()
@Entity()
export class SurveyCrawlHistory {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column('uuid')
  survey_list_config_id: string;

  @ManyToOne(() => SurveyListConfig, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'survey_list_config_id' })
  survey_list_config: SurveyListConfig;

  @Field()
  @Column('uuid')
  crawl_job_id: string;

  @ManyToOne(() => CrawlJob, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'crawl_job_id' })
  crawl_job: CrawlJob;

  @Field()
  @Column({ type: 'varchar' })
  sid: string;

  @Field()
  @Column({ type: 'varchar' })
  status: string;

  @Field(() => Int)
  @Column({ type: 'integer', default: 0 })
  records_fetched: number;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  error_message: string;

  @Field(() => Date)
  @Column({ type: 'timestamptz' })
  started_at: Date;

  @Field(() => Date, { nullable: true })
  @Column({ type: 'timestamptz', nullable: true })
  completed_at: Date;

  @Field(() => Date)
  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}
