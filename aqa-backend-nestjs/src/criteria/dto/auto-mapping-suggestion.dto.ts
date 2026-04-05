import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AutoMappingSuggestion {
  @Field()
  display_name: string;

  @Field(() => [ID])
  criteriaIds: string[];

  @Field(() => [ID])
  staffSurveyCriteriaIds: string[];

  @Field(() => [String])
  semesters: string[];
}
