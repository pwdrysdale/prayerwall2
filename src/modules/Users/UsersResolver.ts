import {
    Arg,
    Authorized,
    Ctx,
    FieldResolver,
    Mutation,
    Query,
    Resolver,
    Root,
} from "type-graphql";
import { Following } from "../../entity/Following";
import { Prayer } from "../../entity/Prayer";
import { User, UserRole } from "../../entity/User";
import { AppContext } from "../../utlis/context";

@Resolver(User)
export class UserResolver {
    @FieldResolver(() => Prayer)
    async prayers(
        @Root() user: User,
        @Ctx() { req }: AppContext
    ): Promise<Prayer[]> {
        const u: User = await User.findOne(user.id, {
            relations: ["prayers", "prayers.user"],
        });

        if (req.user) {
            return u.prayers.filter(
                (prayer: Prayer) =>
                    prayer.user.id === req.user.id || prayer.privat === false
            );
        } else {
            return u.prayers.filter(
                (prayer: Prayer) => prayer.privat === false
            );
        }
    }

    @Query(() => User, { nullable: true })
    async me(@Ctx() { req }: AppContext): Promise<User | null> {
        if (req.user && req.user.id) {
            const user = await User.findOne({
                where: { id: req.user.id },
                relations: [
                    "createdFollows",
                    "createdFollows.followingId",
                    "lists",
                    "lists.prayers",
                ],
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

    @Authorized([UserRole.admin, UserRole.loggedIn])
    @Query((): typeof User[] => [User])
    async getMyFollowers(@Ctx() { req }: AppContext): Promise<User[] | null> {
        try {
            const people = await Following.find({
                where: { userId: { id: req.user.id } },
                relations: ["followingId"],
            });
            return people.map((f) => f.followingId);
        } catch {
            return null;
        }
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

    @Mutation(() => Boolean)
    async unfollow(
        @Ctx() { req }: AppContext,
        @Arg("id") id: number
    ): Promise<boolean> {
        try {
            if (!req.user) {
                return false;
            }

            const toUnfollow = await User.findOne(id);
            if (!toUnfollow) {
                return false;
            }

            const user: User = await User.findOne(req.user.id);

            await Following.delete({
                userId: user,
                followingId: toUnfollow,
            });

            return true;
        } catch (err) {
            return false;
        }
    }
}
