import { Field, Float, ObjectType } from "type-graphql";
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { Prayer } from "./Prayer";
import { User } from "./User";

@ObjectType()
@Entity()
export class List extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column()
    privat: boolean;

    @Field()
    @Column()
    name: string;

    @Field()
    @Column()
    description: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    photo: string;

    @Field(() => Float)
    get length(): number {
        return this.prayers.filter((P: Prayer) => P.privat === false).length;
    }

    @Field(() => User)
    @ManyToOne(() => User)
    owner: User;

    @Field(() => [Prayer], { nullable: true })
    @ManyToMany(() => Prayer, (prayer) => prayer.lists, { nullable: true })
    prayers: Prayer[];

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
