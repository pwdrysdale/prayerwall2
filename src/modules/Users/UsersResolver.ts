import { Authorized, Ctx, Query, Resolver } from "type-graphql";
import { User, UserRole } from "../../entity/User";
import { AppContext } from "../../utlis/context";

@Resolver()
export class UserResolver {
    @Query(() => User, { nullable: true })
    async me(@Ctx() { req }: AppContext): Promise<User | null> {
        return req.user;
    }

    // @Authorized(UserRole.admin)
    @Query((): typeof User[] => [User])
    async allUsers(): Promise<User[] | null> {
        return await User.find();
    }
}
