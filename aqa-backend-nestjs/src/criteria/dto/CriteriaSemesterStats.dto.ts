import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class CriteriaSemesterStats {
  @Field()
  semester: string;

  @Field(() => Int)
  lt: number;

  @Field(() => Int)
  ht1: number;

  @Field(() => Int)
  ht2: number;
}
