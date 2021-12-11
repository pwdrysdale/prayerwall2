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
import { AddRemovePrayerToListInputs } from "../Prayers/inputs/AddPrayerToListInputs";
import { EditListInput } from "./inputs/EditListInput";
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
            // console.log(ls);
            return ls;
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    @Query(() => List, { nullable: true })
    async singleList(
        @Ctx() { req }: AppContext,
        @Arg("id") id: number
    ): Promise<List | null> {
        try {
            const list = await List.findOne(id, {
                relations: [
                    "owner",
                    "prayers",
                    "prayers.user",
                    "prayers.lists",
                    "prayers.comments",
                ],
            });
            if (list.owner.id === req.user.id || list.privat !== true) {
                return list;
            }
            return null;
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    @Mutation(() => List, { nullable: true })
    async createList(
        @Ctx() { req }: AppContext,
        @Arg("ListInput") { name, description, privat, photo }: ListInput
    ): Promise<List | null> {
        try {
            const user = await User.findOne(req.user.id);
            return await List.create({
                name,
                description,
                privat,
                owner: user,
                photo,
            }).save();
        } catch {
            return null;
        }
    }

    @Mutation(() => List, { nullable: true })
    async editList(
        @Ctx() { req }: AppContext,
        @Arg("EditListInput")
        { id, name, description, privat, photo }: EditListInput
    ): Promise<List | null> {
        try {
            const list = await List.findOne(id, {
                relations: ["owner"],
            });
            if (list.owner.id === req.user.id) {
                list.name = name;
                list.description = description;
                list.privat = privat;
                list.photo = photo;
                await list.save();
                return list;
            }
            return null;
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    @Mutation(() => List, { nullable: true })
    async addToList(
        @Ctx() { req }: AppContext,
        @Arg("AddRemovePrayerToListInputs")
        { prayerId, listId }: AddRemovePrayerToListInputs
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
                // console.log(list);
                await list.save();
                return list;
            }
            return null;
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    @Mutation(() => List, { nullable: true })
    async removeFromList(
        @Ctx() { req }: AppContext,
        @Arg("AddRemovePrayerToListInputs")
        { prayerId, listId }: AddRemovePrayerToListInputs
    ): Promise<List | null> {
        try {
            const list = await List.findOne(listId, {
                relations: ["owner", "prayers"],
            });
            if (list.owner.id !== req.user.id) {
                console.log("not the same guy?");
                return null;
            }
            const prayer = await Prayer.findOne(prayerId, {
                relations: ["lists"],
            });
            if (list && prayer) {
                list.prayers = list.prayers.filter((p) => p.id !== prayerId);
                await list.save();

                return list;
            }
            return null;
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    @Mutation(() => Boolean, { nullable: true })
    async deleteList(
        @Ctx() { req }: AppContext,
        @Arg("id") id: number
    ): Promise<boolean> {
        try {
            const list = await List.findOne(id, {
                relations: ["owner"],
            });
            if (list.owner.id === req.user.id) {
                await List.delete(id);
                return true;
            }
            return false;
        } catch (err) {
            console.log(err);
            return false;
        }
    }
}
