import { Field, InputType } from "type-graphql";
import { PrayerInput } from "./PrayerInput";

@InputType()
export class EditPrayerInput extends PrayerInput {
    @Field()
    id: number;
}
