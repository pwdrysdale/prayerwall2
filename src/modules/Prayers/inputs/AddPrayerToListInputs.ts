import { Field, InputType } from "type-graphql";

@InputType()
export class AddRemovePrayerToListInputs {
    @Field()
    prayerId: number;

    @Field()
    listId: number;
}
