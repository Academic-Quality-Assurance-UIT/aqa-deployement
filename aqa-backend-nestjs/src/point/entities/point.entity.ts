import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { Class } from 'src/class/entities/class.entity';
import { Criteria } from 'src/criteria/entities/criteria.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Point {
  @PrimaryColumn()
  @Field(() => String)
  point_id: string;

  @Index()
  @Column()
  @Field(() => Int)
  max_point: number;

  @Column({ type: 'float' })
  @Field(() => Float)
  point: number;

  @ManyToOne(() => Class)
  @JoinColumn({ name: 'class_id' })
  @Field(() => Class, { nullable: true })
  class: Class;

  @Index()
  @Column()
  @Field()
  class_id: string;

  @ManyToOne(() => Criteria)
  @JoinColumn({ name: 'criteria_id' })
  @Field(() => Criteria, { nullable: true })
  criteria: Criteria;

  @Index()
  @Column()
  @Field()
  criteria_id: string;
}
