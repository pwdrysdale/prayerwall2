import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Following } from "../../entity/Following";
import { User, UserRole } from "../../entity/User";
import { AppContext } from "../../utlis/context";

@Resolver()
export class UserResolver {
    @Query(() => User, { nullable: true })
    async me(@Ctx() { req }: AppContext): Promise<User | null> {
        if (req.user && req.user.id) {
            const user = await User.findOne({
                where: { id: req.user.id },
                relations: ["createdFollows", "createdFollows.followingId"],
            });
            return user;
        } else return null;
    }

    // Get a list of all users
    // Auth: admin only
    @Authorized(UserRole.admin)
    @Query((): typeof User[] => [User])
    async allUsers(): Promise<User[] | null> {
        return await User.find();
    }

    @Mutation(() => Boolean)
    async follow(
        @Ctx() { req }: AppContext,
        @Arg("id") id: number
    ): Promise<boolean> {
        try {
            if (!req.user) {
                return false;
            }

            const toFollow = await User.findOne(id);
            if (!toFollow) {
                return false;
            }

            const user: User = await User.findOne(req.user.id);

            await Following.create({
                userId: user,
                followingId: toFollow,
            }).save();

            return true;
        } catch (err) {
            return false;
        }
    }
}
