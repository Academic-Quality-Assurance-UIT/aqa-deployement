import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class StagingDataTypeCount {
  @Field()
  type: string;

  @Field(() => Int)
  count: number;
}

@ObjectType()
export class CrawlStagingDataSummary {
  @Field(() => Int)
  totalRecords: number;

  @Field(() => [StagingDataTypeCount])
  byType: StagingDataTypeCount[];
}
