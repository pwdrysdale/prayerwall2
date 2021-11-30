import { Field, Float, InputType, registerEnumType } from "type-graphql";
import { IsArray, IsBoolean, IsEnum, IsString, Length } from "class-validator";
import { PrayerCategory } from "../../../entity/Prayer";
import { Photo } from "../../Unsplash/PhotoTypes";
import { PhotoObject } from "../../../entity/Photo";
import { Any } from "typeorm";

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

    @Field()
    category: number;

    @Field(() => [Float])
    lists: number[];

    // @Field()
    // status: string;
    // @Field(() => Any, { nullable: true })

    @Field()
    photo: string;
}
