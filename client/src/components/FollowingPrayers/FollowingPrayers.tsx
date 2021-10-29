import { useQuery } from "@apollo/client";
import { loader } from "graphql.macro";
import React, { useEffect } from "react";
import { useToasts } from "../../store/useToasts";
import { Prayer } from "../../types";

const GET_FOLLOWING_PRAYERS = loader("./getFollowingPrayers.graphql");

const FollowingPrayers = () => {
    const { addToast } = useToasts();

    const { loading, error, data } = useQuery(GET_FOLLOWING_PRAYERS, {
        errorPolicy: "all",
        onError: (error) => {
            if (
                error.message ===
                "Access denied! You don't have permission for this action!"
            ) {
                addToast({
                    message:
                        "Access denied! You don't have permission for this action!",
                    type: "error",
                });
            }
        },
    });

    useEffect(() => {
        console.log("data");
        console.log(data);
    }, [data]);

    if (loading) return <p>Loading...</p>;

    if (
        error?.message ===
        "Access denied! You don't have permission for this action!"
    ) {
        return <div>Login to see who you follow!</div>;
    }

    if (error) return <p>Error :(</p>;

    if (!data) {
        return <p>No data</p>;
    }

    return (
        <div>
            <h1>Prayers of those I follow</h1>
            {data.getFollowingPrayers?.map((prayer: Prayer) => (
                <div key={prayer.id}>
                    <h2>{prayer.title}</h2>
                    <p>{prayer.body}</p>
                </div>
            )) ?? <p>No prayers to show - Follow someone!</p>}
        </div>
    );
};

export default FollowingPrayers;
