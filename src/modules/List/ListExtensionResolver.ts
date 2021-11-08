import { FieldResolver, Resolver, Root } from "type-graphql";
import { List } from "../../entity/List";

@Resolver((of) => List)
export class ListExtensionResolver {
    @FieldResolver()
    length(@Root("length") list: List): number {
        return list.prayers.length || 0;
    }
}
