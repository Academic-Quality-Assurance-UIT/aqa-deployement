import { Field, Int, ObjectType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';

@ObjectType()
export class CommentStatisticData {
  @Field()
  label: string;

  @Field(() => Int)
  total: number;

  @Field(() => GraphQLJSON)
  sentiments: any;

  @Field(() => GraphQLJSON)
  topics: any;
}
