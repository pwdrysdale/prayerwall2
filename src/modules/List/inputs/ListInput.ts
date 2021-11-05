import { Length } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class ListInput {
    @Field()
    @Length(1, 100)
    name: string;

    @Field()
    @Length(2, 10000)
    description: string;

    @Field()
    privat: boolean;
}
