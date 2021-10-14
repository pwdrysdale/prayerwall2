import { AuthChecker } from "type-graphql";
import { AppContext } from "./context";

export const authChecker: AuthChecker<AppContext> = async (
    { context },
    roles
) => {
    if (roles.length === 0) return false;

    const { role } = context.req.user;

    if (roles.includes(role)) return true;

    return false;
};
