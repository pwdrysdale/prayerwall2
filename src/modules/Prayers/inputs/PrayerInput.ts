import { Field, InputType, registerEnumType } from "type-graphql";
import { IsBoolean, IsEnum, IsString, Length } from "class-validator";
import { PrayerCategory } from "../../../entity/Prayer";

registerEnumType(PrayerCategory, {
    name: "RegisteredPrayerCategory",
});

@InputType()
export class PrayerInput {
    @Field()
    @Length(1, 100)
    title: string;

    @Field()
    @Length(2, 10000)
    body: string;

    @Field()
    privat: boolean;

    @Field()
    answered: boolean;

    @Field((type) => PrayerCategory)
    @IsString()
    category: PrayerCategory;

    // @Field()
    // status: string;
}
