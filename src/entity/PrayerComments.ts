import { GraphQLScalarType } from "graphql";
import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Prayer } from "./Prayer";
import { User } from "./User";

export enum PrayerCategory {
  "thanks" = "Thanks",
  "sorry" = "Sorry",
  "please" = "Please",
}

@ObjectType()
@Entity()
export class PrayerComments extends BaseEntity {
  @Field((): GraphQLScalarType => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  body: string;

  @Field()
  @Column({ default: true })
  privat: boolean;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.comments, { nullable: true })
  user: User;

  @Field(() => Prayer, { nullable: true })
  @ManyToOne(() => Prayer, (prayer) => prayer.comments, {
    onDelete: "CASCADE",
  })
  prayer: Prayer;

  @Field()
  @CreateDateColumn({
    type: "timestamp",
    name: "createdDate",
  })
  createdDate!: Date;

  @Field()
  @UpdateDateColumn({
    type: "timestamp",
    name: "updateDate",
  })
  updateDate!: Date;
}
