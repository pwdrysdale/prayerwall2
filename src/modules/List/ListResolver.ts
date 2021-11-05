import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { List } from "../../entity/List";
import { User } from "../../entity/User";
import { AppContext } from "../../utlis/context";
import { ListInput } from "./inputs/ListInput";

@Resolver()
export class ListResolver {
    @Query(() => [List], { nullable: true })
    async myLists(@Ctx() { req }: AppContext): Promise<List[] | null> {
        try {
            console.log("User: ", req.user.id);
            const ls = await List.find({
                where: { owner: { id: req.user.id } },
                relations: ["prayers"],
            });
            console.log(ls);
            return ls;
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    @Mutation(() => List, { nullable: true })
    async createList(
        @Ctx() { req }: AppContext,
        @Arg("ListInput") { name, description, privat }: ListInput
    ): Promise<List | null> {
        try {
            const user = await User.findOne(req.user.id);
            return await List.create({
                name,
                description,
                privat,
                owner: user,
            }).save();
        } catch {
            return null;
        }
    }
}
