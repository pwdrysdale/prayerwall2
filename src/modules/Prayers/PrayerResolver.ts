import {
    Arg,
    Ctx,
    Mutation,
    Query,
    Resolver,
    PubSub,
    Authorized,
    FieldResolver,
    Root,
} from "type-graphql";
import { FindManyOptions, In, LessThan } from "typeorm";
import { Prayer } from "../../entity/Prayer";
import { User, UserRole } from "../../entity/User";
import { AppContext } from "../../utlis/context";
import { PrayerInput } from "./inputs/PrayerInput";

import { format } from "date-fns";
import { EditPrayerInput } from "./inputs/EditPrayerInput";
import { PrayerComments } from "../../entity/PrayerComments";
import { PrayerCommentInput } from "./inputs/PrayerCommentInput";
import { PubSubEngine } from "graphql-subscriptions";
import { PrayerPrayedBy } from "../../entity/PrayerPrayedBy";
import { Following } from "../../entity/Following";
import { List } from "../../entity/List";
import { Photo } from "../Unsplash/PhotoTypes";
import { PhotoObject } from "../../entity/Photo";

@Resolver(Prayer)
export class PrayerResolver {
    @FieldResolver({ nullable: true })
    async prayedByUser(
        @Root() prayer: Prayer,
        @Ctx() { req }: AppContext
    ): Promise<number | null> {
        if (!req.user) return null;
        const prayedBy = await PrayerPrayedBy.find({
            where: { prayer: prayer.id, user: req.user.id },
        });
        return prayedBy.length;
    }

    // Get all the public prayers
    // Authh: all users
    @Query((): typeof Prayer[] => [Prayer], { nullable: true })
    async publicPrayers(
        @Arg("cursor", { nullable: true }) cursor: string,
        @Ctx() { req }: AppContext
    ): Promise<Prayer[] | null> {
        try {
            const options: FindManyOptions<Prayer> = {
                take: 6,
                order: { createdDate: "DESC" },
                where: { privat: false },
                relations: ["user", "comments", "prayedBy", "prayedBy.user"],
            };

            if (cursor) {
                options.where = {
                    createdDate: LessThan(
                        format(new Date(cursor), "yyyy-MM-dd HH:mm:ss")
                    ),
                    privat: false,
                };
            }

            const p: Prayer[] = await Prayer.find(options);
            if (p) {
                if (!req.user) {
                    console.log("Still in here");
                    const returnVal: Prayer[] = p.map(
                        (prayer: Prayer): Prayer =>
                            Object.assign(prayer, { prayedByUser: 0 })
                    );
                    return returnVal;
                } else {
                    const status = p.map(
                        (p: Prayer): Prayer =>
                            Object.assign(p, {
                                prayedByUser: p.prayedBy
                                    .map((prayed) => prayed.user.id)
                                    .filter((id: number) => id === req.user.id)
                                    .length,
                            })
                    );
                    return status;
                }
            } else return null;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    // Get all the prayers of the current logged in user
    // Auth: any logged in user
    @Authorized([UserRole.admin, UserRole.loggedIn])
    @Query((): typeof Prayer[] => [Prayer], { nullable: true })
    async myPrayers(@Ctx() { req }: AppContext): Promise<Prayer[] | null> {
        try {
            if (!req.user) {
                return null;
            }

            const p: Prayer[] = await Prayer.find({
                where: { user: { id: req.user.id } },
                relations: ["prayedBy"],
            });

            if (p) {
                return p;
            } else return null;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    // Get one prayer (for editing or comments)
    // Auth: any user => prayer must be public or user the owner of the prayer
    @Query(() => Prayer, { nullable: true })
    async onePrayer(
        @Ctx() { req }: AppContext,
        @Arg("id") id: number
    ): Promise<Prayer | null> {
        try {
            const p: Prayer = await Prayer.findOne(id, {
                relations: ["user", "comments", "comments.user", "lists"],
            });
            if (p && (p.privat === false || p.user.id === req.user.id)) {
                return p;
            } else return null;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    @Query(() => [Prayer])
    async getFollowingPrayers(
        @Ctx() { req }: AppContext
    ): Promise<Prayer[] | null> {
        try {
            if (!req.user) {
                console.log("No user");
                return null;
            }

            const me = await User.findOne(req.user.id, {
                relations: ["createdFollows", "createdFollows.followingId"],
            });
            const ids: number[] = me.createdFollows.map(
                (f: Following) => f.followingId.id
            );
            const prayers = await Prayer.find({
                where: {
                    user: { id: In(ids) },
                    privat: false,
                },
            });
            console.log(prayers);
            return prayers;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    // Add a prayer
    // Auth: must be logged in as some kind of user
    @Authorized([UserRole.admin, UserRole.loggedIn])
    @Mutation(() => Prayer)
    async addPrayer(
        @Arg("PrayerInput")
        { title, body, category, answered, privat, lists, photo }: PrayerInput,
        @Ctx() { req }: AppContext,
        @PubSub() pubSub: PubSubEngine
    ): Promise<Prayer | null> {
        try {
            console.log("Photo: ", JSON.parse(photo));
            if (!req.user) {
                return null;
            }

            const l = await (
                await List.findByIds(lists, { relations: ["owner"] })
            ).filter((ls) => ls.owner.id === req.user.id);

            const p = await Prayer.create({
                title,
                body,
                privat,
                answered,
                category,
                user: req.user,
                lists: l,
                photo: JSON.parse(photo),
            }).save();

            if (!privat) {
                const event = `${req.user.username} created the prayer \"${title}\"`;
                pubSub.publish("EVENTS", {
                    event,
                });
            }

            return p;
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    // Edit a prayer
    // Auth: Must be the owner of the prayer
    @Authorized([UserRole.admin, UserRole.loggedIn])
    @Mutation(() => Prayer, { nullable: true })
    async editPrayer(
        @Arg("EditPrayerInput")
        { id, title, body, category, answered, privat, lists }: EditPrayerInput,
        @Ctx() { req }: AppContext
    ): Promise<Prayer | null> {
        try {
            if (!req.user) {
                console.log("no user");
                return null;
            }

            console.log({ id, title, body, category, answered, privat, lists });

            const l = await (
                await List.findByIds(lists, { relations: ["owner"] })
            ).filter((ls) => ls.owner.id === req.user.id);
            console.log(l);

            const p: Prayer = await Prayer.findOne(id, {
                relations: ["user", "comments"],
            });
            console.log("Prayer to edit: ", p);
            if (p.user.id !== req.user.id) {
                console.log("Not who you say you are");
                console.log(p.user);
                console.log(req.user);
                return null;
            } else {
                console.log("updating apparently");
                const u = Object.assign(p, {
                    title,
                    body,
                    category,
                    answered,
                    privat,
                    lists: l,
                });

                const d: Prayer = await u.save();
                return d;
            }
        } catch {
            return null;
        }
    }

    // Delete a prayer
    // Auth: Must be the owner of the prayer or admin
    @Authorized([UserRole.admin, UserRole.loggedIn])
    @Mutation(() => Boolean)
    async deletePrayer(
        @Arg("id")
        id: number,
        @Ctx() { req }: AppContext
    ): Promise<Boolean> {
        console.log("In delete");
        console.log(id);
        try {
            if (!req.user) {
                return false;
            }

            const p: Prayer = await Prayer.findOne(id, { relations: ["user"] });
            console.log(p);
            console.log(p.user.id === req.user.id);
            if (req.user.role === UserRole.admin || p.user.id === req.user.id) {
                await Prayer.delete(id);
                console.log("deleted");
                return true;
            }
            return false;
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    // Add a comment to a prayer
    // Auth: Must be logged in as some kind of user
    @Mutation(() => PrayerComments)
    async addComment(
        @Ctx() { req }: AppContext,
        @Arg("PrayerCommentInput")
        { body, prayerId, privat }: PrayerCommentInput
    ): Promise<PrayerComments | null> {
        try {
            if (!req.user) {
                return null;
            }

            const prayer = await Prayer.findOne(prayerId);
            const user = await User.findOne(req.user);

            return await PrayerComments.create({
                body,
                privat,
                prayer,
                user,
            }).save();
        } catch {
            return null;
        }
    }

    // Delete a comment
    // Auth: Must be the owner of the comment or admin
    @Mutation(() => Boolean)
    async deleteComment(
        @Ctx() { req }: AppContext,
        @Arg("id") id: number
    ): Promise<boolean> {
        try {
            if (!req.user) {
                return false;
            }

            const comment: PrayerComments = await PrayerComments.findOne(id, {
                relations: ["user"],
            });

            if (
                comment.user.id === req.user.id ||
                req.user.role === UserRole.admin
            ) {
                await PrayerComments.delete(id);
                return true;
            } else {
                return false;
            }
        } catch {
            return false;
        }
    }

    @Mutation(() => Boolean)
    async prayed(
        @Ctx() { req }: AppContext,
        @Arg("id") id: number
    ): Promise<boolean> {
        try {
            if (!req.user) {
                return false;
            }

            const prayer: Prayer = await Prayer.findOne(id);
            const user: User = await User.findOne(req.user.id);

            await PrayerPrayedBy.create({
                prayer,
                user,
            }).save();

            return true;
        } catch (err) {
            return false;
        }
    }
}
