import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Point } from 'src/point/entities/point.entity';
import { Semester } from 'src/semester/entities/semester.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { CriteriaMapping } from './criteria-mapping.entity';

@ObjectType()
@Entity()
export class Criteria {
  @Field()
  @PrimaryColumn()
  criteria_id: string;

  @Field()
  @Column()
  display_name: string;

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  index: number;

  @ManyToOne(() => Semester)
  @JoinColumn({ name: 'semester_id' })
  semester: Semester;

  @Field({ nullable: true })
  @Column({ nullable: true })
  semester_id: string;

  @Field({ defaultValue: true })
  @Column({ default: true })
  is_shown: boolean;

  @OneToMany(() => Point, (point) => point.criteria)
  points: Point[];

  @Field(() => CriteriaMapping, { nullable: true })
  @ManyToOne(() => CriteriaMapping, (mapping) => mapping.criteria, {
    nullable: true,
  })
  @JoinColumn({ name: 'mapping_id' })
  mapping: CriteriaMapping;

  @Field({ nullable: true })
  @Column({ nullable: true })
  mapping_id: string;
}
