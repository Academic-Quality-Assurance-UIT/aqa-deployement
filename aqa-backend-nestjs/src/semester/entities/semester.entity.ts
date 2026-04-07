import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Semester {
  @PrimaryColumn()
  @Field(() => String)
  semester_id: string;

  @Column()
  @Field()
  display_name: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  type: string;

  @Index()
  @Column({ nullable: true })
  @Field({ nullable: true })
  year: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  search_string: string;
}
