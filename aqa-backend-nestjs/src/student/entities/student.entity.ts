import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, PrimaryColumn, Index } from 'typeorm';

@ObjectType()
@Entity({ name: 'student' })
export class Student {
  @Column({ nullable: true })
  @Field({ nullable: true })
  @Index()
  tid: string;

  @Column()
  @Field(() => Int)
  @Index()
  sid: number;

  @Column({ nullable: true })
  @Field({ nullable: true })
  firstname: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  lastname: string;

  @PrimaryColumn()
  @Field(() => String)
  email: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  token: string;

  @Column({ nullable: true, type: 'timestamptz' })
  @Field({ nullable: true })
  completed_at: Date;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  usesleft: number;

  // Attributes mapped from API response
  @Column({ nullable: true })
  @Field({ nullable: true })
  @Index()
  mssv: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  khoa: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  k: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  hedt: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  @Index()
  malop: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  magv: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  tengv: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  tenmh: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  khoaql: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  nganh: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  tennganh: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  @Index()
  semester_name: string;
}
