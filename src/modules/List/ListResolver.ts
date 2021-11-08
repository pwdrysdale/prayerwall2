import {
    Arg,
    Ctx,
    FieldResolver,
    Mutation,
    Query,
    Resolver,
    Root,
} from "type-graphql";
import { List } from "../../entity/List";
import { Prayer } from "../../entity/Prayer";
import { User } from "../../entity/User";
import { AppContext } from "../../utlis/context";
import { AddPrayerToListInputs } from "../Prayers/inputs/AddPrayerToListInputs";
import { ListInput } from "./inputs/ListInput";

@Resolver()
export class ListResolver {
    @Query(() => [List], { nullable: true })
    async myLists(@Ctx() { req }: AppContext): Promise<List[] | null> {
        try {
            const ls = await List.find({
                where: { owner: { id: req.user.id } },
                relations: ["prayers", "prayers.user"],
            });
            console.log(ls);
            return ls;
        } catch (err) {
            // console.log(err);
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

    @Mutation(() => List, { nullable: true })
    async addToList(
        @Ctx() { req }: AppContext,
        @Arg("AddPrayerToListInputs")
        { prayerId, listId }: AddPrayerToListInputs
    ): Promise<List | null> {
        try {
            const list = await List.findOne(listId, {
                relations: ["owner", "prayers"],
            });
            if (list.owner.id !== req.user.id) {
                return null;
            }
            const prayer = await Prayer.findOne(prayerId);
            if (list && prayer) {
                list.prayers.push(prayer);
                console.log(list);
                await list.save();
                return list;
            }
            return null;
        } catch (err) {
            console.log(err);
            return null;
        }
    }
}
