import { Field, InputType } from "type-graphql";
import { ListInput } from "./ListInput";

@InputType()
export class EditListInput extends ListInput {
    @Field()
    id: number;
}
