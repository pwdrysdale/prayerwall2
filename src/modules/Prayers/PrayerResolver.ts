import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { FindManyOptions, LessThan, MoreThan } from "typeorm";
import { Prayer } from "../../entity/Prayer";
import { User } from "../../entity/User";
import { AppContext } from "../../utlis/context";
import { PrayerInput } from "./inputs/PrayerInput";

import { format } from "date-fns";

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
                console.log(p);
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
                console.log("Returning the prayers");
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
}
