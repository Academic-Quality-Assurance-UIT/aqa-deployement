import { Field, Float, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class StaffSurveyPointByCategoryAndYearDTO {
  @Field()
  category: string;

  @Field()
  year: string;

  @Field(() => Float)
  avg_point: number;
}
