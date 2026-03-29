import { ArgsType, Field, ObjectType } from '@nestjs/graphql';
import { UserEntity } from 'src/user/entities/user.entity';

@ObjectType()
export class AuthDto {
  @Field(() => String)
  access_token: string;

  @Field(() => UserEntity)
  user: UserEntity;
}
