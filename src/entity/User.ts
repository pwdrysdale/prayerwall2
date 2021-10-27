import { GraphQLScalarType } from "graphql";
import { Field, ID, ObjectType, Resolver } from "type-graphql";
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";
import { Lazy } from "../utlis/lazyType";
import { Following } from "./Following";
import { Prayer } from "./Prayer";
import { PrayerComments } from "./PrayerComments";
import { PrayerPrayeredBy } from "./PrayerPrayedBy";

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

    @OneToMany(() => Following, (following) => following.userId)
    @Field(() => [Following])
    createdFollows: [Following];

    @OneToMany(() => Following, (following) => following.followingId)
    @Field(() => [Following])
    followingMe: [Following];

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

    @OneToMany(() => PrayerPrayeredBy, (prayedBy) => prayedBy.user, {
        nullable: true,
    })
    @Field(() => [PrayerPrayeredBy])
    prayedBy: [PrayerPrayeredBy] | null;

    @Field()
    @Column()
    username: string;

    @Field()
    @Column({ default: UserRole.loggedIn, enum: UserRole })
    role: string;

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
