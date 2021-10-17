import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Prayer } from "../../entity/Prayer";
import { User } from "../../entity/User";
import { AppContext } from "../../utlis/context";
import { PrayerInput } from "./inputs/PrayerInput";

@Resolver()
export class PrayerResolver {
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
        @Arg("PrayerInput") { title, body }: PrayerInput,
        @Ctx() { req }: AppContext
    ): Promise<Prayer | null> {
        try {
            return await Prayer.create({ title, body, user: req.user }).save();
        } catch {
            return null;
        }
    }
}
