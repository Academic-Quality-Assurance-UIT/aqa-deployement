import { Field, Int, ObjectType } from '@nestjs/graphql';
import { GraphQLJSON } from 'graphql-type-json';

@ObjectType()
export class TopicAssignmentPreview {
  @Field(() => Int)
  totalComments: number;

  @Field(() => Int)
  assignedComments: number;

  @Field(() => Int)
  unassignedComments: number;

  @Field(() => [GraphQLJSON])
  samples: any[];
}
