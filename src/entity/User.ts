import { GraphQLScalarType } from "graphql";
import { Field, ID, ObjectType, Resolver } from "type-graphql";
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    OneToMany,
} from "typeorm";
import { Lazy } from "../utlis/lazyType";
import { Prayer } from "./Prayer";
import { PrayerComments } from "./PrayerComments";

export enum UserRole {
    loggedIn = "loggedIn",
    admin = "admin",
}

@ObjectType()
@Entity()
export class User extends BaseEntity {
    @Field((): GraphQLScalarType => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field({ nullable: true })
    @Column({ nullable: true })
    googleId: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    twitterId: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    githubId: string;

    // @OneToMany(() => Prayer, (entry) => Prayer.user, {
    @OneToMany(() => Prayer, (prayer) => prayer.user, {
        lazy: true,
        nullable: true,
    })
    @Field(() => [Prayer])
    prayers: Lazy<Prayer[]>;

    @OneToMany(() => PrayerComments, (comment) => comment.user, {
        lazy: true,
        nullable: true,
    })
    @Field(() => [PrayerComments])
    comments: Lazy<PrayerComments[]>;

    @Field()
    @Column()
    username: string;

    @Field()
    @Column({ default: UserRole.loggedIn, enum: UserRole })
    role: string;
}
