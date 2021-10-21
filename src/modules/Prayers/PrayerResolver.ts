import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { FindManyOptions, LessThan, MoreThan } from "typeorm";
import { Prayer } from "../../entity/Prayer";
import { User, UserRole } from "../../entity/User";
import { AppContext } from "../../utlis/context";
import { PrayerInput } from "./inputs/PrayerInput";

import { format } from "date-fns";
import { EditPrayerInput } from "./inputs/EditPrayerInput";

@Resolver()
export class PrayerResolver {
    @Query((): typeof Prayer[] => [Prayer], { nullable: true })
    async publicPrayers(
        @Arg("cursor", { nullable: true }) cursor: string
    ): Promise<Prayer[] | null> {
        try {
            const options: FindManyOptions<Prayer> = {
                take: 2,
                order: { createdDate: "DESC" },
                where: { privat: false },
                relations: ["user"],
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
                return p;
            } else return null;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    @Query((): typeof Prayer[] => [Prayer], { nullable: true })
    async myPrayers(@Ctx() { req }: AppContext): Promise<Prayer[] | null> {
        try {
            if (!req.user) {
                return null;
            }

            const p: Prayer[] = await req.user.prayers;

            if (p) {
                return p;
            } else return null;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    @Query(() => Prayer, { nullable: true })
    async onePrayer(
        @Ctx() { req }: AppContext,
        @Arg("id") id: number
    ): Promise<Prayer | null> {
        try {
            const p = await Prayer.findOne(id);
            if (p && (p.privat === false || p.user.id === req.user.id)) {
                return p;
            } else return null;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    @Mutation(() => Prayer)
    async addPrayer(
        @Arg("PrayerInput")
        { title, body, category, answered, privat }: PrayerInput,
        @Ctx() { req }: AppContext
    ): Promise<Prayer | null> {
        try {
            if (!req.user) {
                return null;
            }

            return await Prayer.create({
                title,
                body,
                privat,
                answered,
                category,
                user: req.user,
            }).save();
        } catch {
            return null;
        }
    }

    @Mutation(() => Prayer, { nullable: true })
    async editPrayer(
        @Arg("EditPrayerInput")
        { id, title, body, category, answered, privat }: EditPrayerInput,
        @Ctx() { req }: AppContext
    ): Promise<Prayer | null> {
        try {
            console.log("In edit prayer");
            if (!req.user) {
                console.log("no user");
                return null;
            }

            const p: Prayer = await Prayer.findOne(id, { relations: ["user"] });
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
                });

                const d: Prayer = await u.save();
                return d;
            }
        } catch {
            return null;
        }
    }

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

            const p: Prayer = await Prayer.findOne(id);

            if (
                req.user.role === UserRole.loggedIn ||
                p.user.id === req.user.id
            ) {
                await Prayer.delete(id);
                return true;
            }
            return false;
        } catch {
            return false;
        }
    }
}
