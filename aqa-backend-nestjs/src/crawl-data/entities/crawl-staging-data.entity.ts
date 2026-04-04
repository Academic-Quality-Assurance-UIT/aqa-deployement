import { Field, ObjectType } from '@nestjs/graphql';
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
export class CrawlStagingData {
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
  data_type: string;

  @Field(() => GraphQLJSON)
  @Column({ type: 'jsonb' })
  data: any;

  @Field(() => Date)
  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}
