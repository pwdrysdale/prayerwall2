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
import { User } from "./User";
import { Lazy } from "../utlis/lazyType";

@ObjectType()
@Entity()
export class Prayer extends BaseEntity {
    @Field((): GraphQLScalarType => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column()
    title: string;

    @Field()
    @Column()
    body: string;

    @Field(() => User, { nullable: true })
    @ManyToOne(() => User, { lazy: true, nullable: true })
    user: Lazy<User>;

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
