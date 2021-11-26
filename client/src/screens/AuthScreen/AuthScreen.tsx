import { useQuery } from "@apollo/client";
import Button from "../../components/HTML/Button";

import { loader } from "graphql.macro";
import Card from "../../components/UserCards/Card";
import { userInfo } from "../../store/userInfo";
import { useEffect, useMemo } from "react";
import { useToasts } from "../../store/useToasts";
const Me = loader("./Me.graphql");

const AuthScreen = () => {
    // Void function, a function that returns nothing
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
        clearUser();
        addToast({ message: "Logged out successfully", type: "success" });
        window.open("http://localhost:4000/auth/logout", "_self");
    };

    const { setUser, clearUser, user } = userInfo();
    const { addToast } = useToasts();

    const { data: me, loading, error } = useQuery(Me);

    useEffect(() => {
        console.log(me);
        if (me?.me && user !== me.me) {
            addToast({ message: "Logged in", type: "success" });
        }
        if (me && me.me) {
            setUser(me.me);
        }
        console.log("User: ", user);
    }, [me, setUser, user, addToast]);

    if (loading) return <div>Loading...</div>;
    if (error)
        return <div>There was an error, sorry...{JSON.stringify(error)}</div>;

    return (
        <div>
            <Card
                img={user.image}
                username={user.username || "Anonymous User"}
                role={user.role || "Not logged in"}
            />
            <Button onClick={googleLogin} title="Login with Google" />
            <Button onClick={twitterLogin} title="Login with Twitter" />
            <Button onClick={githubLogin} title="Login with Github" />
            <Button onClick={logout} title="Logout" />
        </div>
    );
};

export default AuthScreen;
