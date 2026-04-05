import { Field, Float, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class StaffSurveyPointByYearDTO {
  @Field()
  year: string;

  @Field(() => Float)
  avg_point: number;
}
