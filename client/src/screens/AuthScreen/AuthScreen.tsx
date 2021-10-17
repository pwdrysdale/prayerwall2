import { useQuery } from "@apollo/client";
import Button from "../../components/HTML/Button";

import { loader } from "graphql.macro";
const Me = loader("./Me.graphql");

const AuthScreen = () => {
    type vf = () => void;

    const googleLogin: vf = (): void => {
        window.open("http://localhost:4000/auth/google", "_self");
    };
    const githubLogin: vf = (): void => {
        window.open("http://localhost:4000/auth/github", "_self");
    };
    const twitterLogin: vf = (): void => {
        window.location.href = "http://localhost:4000/auth/twitter";
    };

    const logout: vf = (): void => {
        window.open("http://localhost:4000/auth/logout", "_self");
    };

    const { data: me, loading, error } = useQuery(Me);

    if (loading) return <div>Loading...</div>;
    if (error)
        return <div>There was an error, sorry...{JSON.stringify(error)}</div>;

    return (
        <div>
            <div>Login: {me.me?.username || "Anonymous User"}</div>
            <div>
                Userrole: {me.Me?.role || "Anonymous Users do not have a role"}
            </div>
            <Button onClick={googleLogin} title="Login with Google" />
            <Button onClick={twitterLogin} title="Login with Twitter" />
            <Button onClick={githubLogin} title="Login with Github" />
            <Button onClick={logout} title="Logout" />
        </div>
    );
};

export default AuthScreen;
