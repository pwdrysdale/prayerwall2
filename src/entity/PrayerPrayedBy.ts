import { Field, ObjectType } from "type-graphql";
import {
    BaseEntity,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Prayer } from "./Prayer";
import { User } from "./User";

@ObjectType()
@Entity()
export class PrayerPrayedBy extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id: number;

    @Field(() => Prayer, { nullable: true })
    @ManyToOne(() => Prayer, (prayer) => prayer.prayedBy, {
        onDelete: "CASCADE",
    })
    prayer: Prayer;

    @Field(() => User, { nullable: true })
    @ManyToOne(() => User, (user) => user.prayedBy, { nullable: true })
    user: User;

    @Field()
    @CreateDateColumn({
        type: "timestamp",
        name: "createdDate",
    })
    createdDate!: Date;
}
