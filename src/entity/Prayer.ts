import { GraphQLScalarType } from "graphql";
import { Field, ID, ObjectType } from "type-graphql";
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { PrayerComments } from "./PrayerComments";
import { PrayerPrayeredBy } from "./PrayerPrayedBy";
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

    @Field()
    @Column({ default: false })
    featured?: boolean;

    @Field(() => User, { nullable: true })
    @ManyToOne(() => User, { nullable: true })
    user: User;

    @Field(() => [PrayerComments])
    @OneToMany(() => PrayerComments, (comments) => comments.prayer)
    comments: [PrayerComments];

    @Field(() => [PrayerPrayeredBy], { nullable: true })
    @OneToMany(() => PrayerPrayeredBy, (prayedBy) => prayedBy.prayer)
    prayedBy: [PrayerPrayeredBy];

    @Field({ defaultValue: 0 })
    prayedByUser: number;

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
