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

export enum PrayerCategory {
    "thanks" = "Thanks",
    "sorry" = "Sorry",
    "please" = "Please",
}

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

    @Field()
    @Column({ enum: PrayerCategory, default: PrayerCategory.thanks })
    category: PrayerCategory;

    @Field()
    @Column({ default: false })
    answered: boolean;

    @Field()
    @Column({ default: true })
    privat: boolean;

    @Field(() => User, { nullable: true })
    @ManyToOne(() => User, { nullable: true })
    user: User;

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
