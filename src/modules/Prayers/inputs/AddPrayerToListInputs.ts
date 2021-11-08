import { Field, InputType } from "type-graphql";

@InputType()
export class AddPrayerToListInputs {
    @Field()
    prayerId: number;

    @Field()
    listId: number;
}
