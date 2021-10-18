import React from "react";

import { loader } from "graphql.macro";
import { Prayer } from "../../types";
import { useQuery } from "@apollo/client";
const publicPrayers = loader("./PublicPrayers.graphql");

const PublicPrayers = () => {
    const { data, loading, error } = useQuery(publicPrayers, {
        errorPolicy: "all",
    });

    if (loading) return <div>Loading...</div>;
    if (error) {
        console.error(error);
        return <div>Sorry, there was an error...</div>;
    }

    if (data.publicPrayers === null) {
        return <div>Returned null data</div>;
    }

    if (data.publicPrayers.length === 0) {
        return <div>You don't have any prayers yet!</div>;
    }

    return (
        <div>
            <h1>Public Prayers</h1>
            <div>
                {data.publicPrayers.map((P: Prayer, idx: number) => (
                    <div key={idx}>
                        <div>{P.title}</div>
                        <div>{P.body}</div>
                        <div>{P.privat ? "Private" : "Public"}</div>
                        <div>{P.category}</div>
                        <div>
                            {P.answered ? "Answered" : "Not answered yet"}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
    // return <div>Something</div>;
};

export default PublicPrayers;
