import { GraphQLScalarType } from "graphql";
import { Field, ID, ObjectType, Resolver } from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

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

    @Field()
    @Column()
    username: string;

    @Field()
    @Column({ default: UserRole.loggedIn, enum: UserRole })
    role: string;
}
