import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { StaffSurveyBatch } from './staff-survey-batch.entity';

@ObjectType()
@Entity()
export class StaffSurveySheet {
  @Field()
  @PrimaryColumn('uuid', { default: () => 'uuid_generate_v4()' })
  staff_survey_sheet_id: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  display_name: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  mscb: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  birth: string;

  @Field({ nullable: true })
  @Column({ nullable: true, type: 'boolean' })
  gender: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  faculty: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  academic_degree: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  academic_title: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  additional_comment: string;

  @ManyToOne(() => StaffSurveyBatch)
  @JoinColumn({ name: 'staff_survey_batch_id' })
  @Field(() => StaffSurveyBatch, { nullable: true })
  batch: StaffSurveyBatch;
}
