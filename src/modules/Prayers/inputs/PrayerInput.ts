import { Field, InputType } from "type-graphql";
import { Length } from "class-validator";

@InputType()
export class PrayerInput {
    @Field()
    @Length(1, 100)
    title: string;

    @Field()
    @Length(2, 10000)
    body: string;

    // @Field()
    // status: string;
}
