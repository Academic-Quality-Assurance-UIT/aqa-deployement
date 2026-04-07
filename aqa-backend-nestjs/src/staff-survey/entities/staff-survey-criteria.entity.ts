import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  PrimaryColumn,
  Unique,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { CriteriaMapping } from '../../criteria/entities/criteria-mapping.entity';

@ObjectType()
@Entity()
@Unique(['display_name', 'category'])
export class StaffSurveyCriteria {
  @Field()
  @PrimaryColumn('uuid', { default: () => 'uuid_generate_v4()' })
  staff_survey_criteria_id: string;

  @Field()
  @Column()
  display_name: string;

  @Field()
  @Column()
  category: string;

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  index: number;

  @Field(() => [String], { defaultValue: [] })
  @Column({ type: 'text', array: true, default: () => "'{}'" })
  semesters: string[];

  @Field({ defaultValue: true })
  @Column({ default: true })
  is_point_aggregated: boolean;

  @Field({ defaultValue: true })
  @Column({ default: true })
  @Index()
  is_shown: boolean;

  @Field(() => CriteriaMapping, { nullable: true })
  @ManyToOne(() => CriteriaMapping, (mapping) => mapping.staffSurveyCriteria, {
    nullable: true,
  })
  @JoinColumn({ name: 'mapping_id' })
  mapping: CriteriaMapping;

  @Field({ nullable: true })
  @Column({ nullable: true })
  @Index()
  mapping_id: string;
}
