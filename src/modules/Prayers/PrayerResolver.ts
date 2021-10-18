import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Prayer } from "../../entity/Prayer";
import { User } from "../../entity/User";
import { AppContext } from "../../utlis/context";
import { PrayerInput } from "./inputs/PrayerInput";

@Resolver()
export class PrayerResolver {
    @Query((): typeof Prayer[] => [Prayer], { nullable: true })
    async publicPrayers(): Promise<Prayer[] | null> {
        try {
            const p: Prayer[] = await Prayer.find({ where: { privat: false } });
            console.log(p);
            if (p) {
                console.log("Returning the prayers");
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
