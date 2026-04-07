import { Field, ObjectType, InputType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CrawlJobType } from '../enums/crawl-job-type.enum';

@ObjectType()
@Entity()
export class SurveyListConfig {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => CrawlJobType)
  @Column({ type: 'varchar' })
  survey_type: CrawlJobType;

  @Field()
  @Column({ type: 'varchar' })
  sid: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', nullable: true })
  title: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', nullable: true })
  type: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', nullable: true })
  year: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', nullable: true })
  semester_type: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', nullable: true })
  semester_name: string;

  @Field(() => Boolean)
  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Field(() => Date)
  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @Field(() => Date, { nullable: true })
  @Column({ type: 'timestamptz', nullable: true })
  last_crawled_at: Date;

  @Field(() => Date)
  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}

@InputType()
export class SurveyListConfigInput {
  @Field({ nullable: true })
  id?: string;

  @Field(() => CrawlJobType)
  survey_type: CrawlJobType;

  @Field()
  sid: string;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  type?: string;

  @Field({ nullable: true })
  year?: string;

  @Field({ nullable: true })
  semester_type?: string;

  @Field({ nullable: true })
  semester_name?: string;

  @Field(() => Boolean, { nullable: true })
  is_active?: boolean;
}
