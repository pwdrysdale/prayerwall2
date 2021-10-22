import { Field, InputType } from "type-graphql";

@InputType()
export class PrayerCommentInput {
    @Field()
    prayerId: number;

    @Field()
    body: string;

    @Field()
    privat: boolean;
}
