import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class LecturerRankingSubject {
  @Field()
  subject_id: string;

  @Field({ nullable: true })
  display_name: string;
}

@ObjectType()
export class LecturerRankingItem {
  @Field(() => Int)
  rank: number;

  @Field()
  lecturer_id: string;

  @Field({ nullable: true })
  display_name: string;

  @Field({ nullable: true })
  faculty_id: string;

  @Field({ nullable: true })
  faculty_name: string;

  @Field(() => Float)
  avg_point: number;

  @Field(() => Int)
  total_subjects: number;

  @Field(() => Int)
  total_classes: number;

  @Field(() => Int, { nullable: true })
  previous_rank: number;

  @Field(() => [LecturerRankingSubject], { nullable: true })
  taught_subjects: LecturerRankingSubject[];
}

@ObjectType()
export class LecturerRankingResult {
  @Field(() => [LecturerRankingItem])
  items: LecturerRankingItem[];
}
