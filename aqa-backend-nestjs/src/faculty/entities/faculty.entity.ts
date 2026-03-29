import { Field, ObjectType } from '@nestjs/graphql';
import { Lecturer } from 'src/lecturer/entities/lecturer.entity';
import {
  GroupedPoint,
  PaginatedGroupedPoint,
} from 'src/point/dto/PaginatedGroupedPoint';
import { Subject } from 'src/subject/entities/subject.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Faculty {
  @PrimaryColumn()
  @Field(() => String)
  faculty_id: string;

  @Column()
  @Field()
  display_name: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  full_name: string;

  @Column({ default: true })
  @Field(() => Boolean, { nullable: true, defaultValue: true })
  is_displayed: boolean;

  @OneToMany(() => Lecturer, (lecturer) => lecturer.faculty)
  lecturers: Lecturer[];

  @OneToMany(() => Subject, (subject) => subject.faculty)
  subjects: Subject[];

  @Field(() => GroupedPoint, { nullable: true })
  total_point: GroupedPoint;

  @Field(() => PaginatedGroupedPoint, { nullable: true })
  points: PaginatedGroupedPoint;
}
