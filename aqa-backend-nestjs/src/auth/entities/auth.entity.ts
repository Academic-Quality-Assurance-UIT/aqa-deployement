import { Field, ObjectType } from '@nestjs/graphql';
import { UserEntity } from 'src/user/entities/user.entity';

@ObjectType()
export class AuthEntity extends UserEntity {
  @Field()
  access_token: string;

  constructor() {
    super();
  }
}
