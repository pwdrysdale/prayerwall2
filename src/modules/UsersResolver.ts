import { Authorized, Query, Resolver } from "type-graphql";
import { User, UserRole } from "../entity/User";

@Resolver()
export class UserResolver {
    // @Authorized(UserRole.admin)
    @Query((): typeof User[] => [User])
    async allUsers(): Promise<User[] | null> {
        return await User.find();
    }
}
