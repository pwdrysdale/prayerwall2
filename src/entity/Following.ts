import { formatError } from "graphql";
import { Field, ObjectType } from "type-graphql";
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

@ObjectType()
@Entity()
export class Following extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id: number;

    @Field(() => User)
    @ManyToOne(() => User, (user) => user.createdFollows)
    userId: User;

    @Field(() => User)
    @ManyToOne(() => User, (user) => user.followingMe)
    followingId: User;

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
