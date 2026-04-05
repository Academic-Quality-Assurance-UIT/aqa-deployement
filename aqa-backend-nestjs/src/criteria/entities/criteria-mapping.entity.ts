import { Field, ObjectType, ID } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Criteria } from './criteria.entity';
import { StaffSurveyCriteria } from '../../staff-survey/entities/staff-survey-criteria.entity';

@ObjectType()
@Entity()
export class CriteriaMapping {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  display_name: string;

  @Field(() => [String], { defaultValue: [] })
  @Column({ type: 'text', array: true, default: '{}' })
  raw_display_names: string[];

  @OneToMany(() => Criteria, (criteria) => criteria.mapping)
  @Field(() => [Criteria], { nullable: true })
  criteria: Criteria[];

  @OneToMany(() => StaffSurveyCriteria, (staffSurveyCriteria) => staffSurveyCriteria.mapping)
  @Field(() => [StaffSurveyCriteria], { nullable: true })
  staffSurveyCriteria: StaffSurveyCriteria[];
}
