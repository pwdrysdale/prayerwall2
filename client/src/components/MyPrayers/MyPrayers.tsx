import { useQuery } from "@apollo/client";
import { useEffect } from "react";

import { loader } from "graphql.macro";
import { Prayer } from "../../types";
import { useToasts } from "../../store/useToasts";
import RenderPrayer from "../RenderPrayer/RenderPrayer";
import { userInfo } from "../../store/userInfo";
import { Redirect } from "react-router";

const myPrayers = loader("./MyPrayers.graphql");

const MyPrayers = () => {
    const { user } = userInfo();

    const { addToast } = useToasts();

    const { data, loading, error } = useQuery(myPrayers, {
        errorPolicy: "all",
        onError: (error) => {
            error.message ===
            "Access denied! You don't have permission for this action!"
                ? addToast({
                      message:
                          "You are not logged in, so we can't see your prayers!",
                      type: "error",
                  })
                : addToast({ message: error.message, type: "error" });
        },
    });

    useEffect(() => {
        console.log(data && data.myPrayers);
    }, [data]);

    if (!user.id) return <Redirect to="/login" />;
    if (loading) return <div>Loading...</div>;
    if (error) {
        if (
            error.message ===
            "Access denied! You don't have permission for this action!"
        ) {
            return <div>You need to login to see your prayers!</div>;
        } else {
            return <div>Sorry, there was an error...</div>;
        }
    }

    if (data.myPrayers === null) {
        return <div>Login to create some prayers!</div>;
    }

    if (data.myPrayers.length === 0) {
        return <div>You don't have any prayers yet!</div>;
    }

    return (
        <div>
            <h1>My Prayers</h1>
            <div className="prayerContainer">
                {data.myPrayers.map((P: Prayer, idx: number) => (
                    <RenderPrayer key={idx} prayer={P} me={data.me} />
                ))}
            </div>
        </div>
    );
};

export default MyPrayers;
