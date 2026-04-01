import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@ObjectType()
@Entity()
export class AdminSetting {
  @PrimaryColumn()
  @Field(() => String)
  key: string;

  @Column()
  @Field(() => String)
  value: string;
}
