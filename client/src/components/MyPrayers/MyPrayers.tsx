import { useQuery } from "@apollo/client";
import { useEffect } from "react";

import { loader } from "graphql.macro";
const myPrayers = loader("./MyPrayers.graphql");

export interface Prayer {
    title: string;
    body: string;
}

const MyPrayers = () => {
    const { data, loading, error } = useQuery(myPrayers, {
        errorPolicy: "all",
    });

    useEffect(() => {
        console.log(data && data.myPrayers);
    }, [data]);

    if (loading) return <div>Loading...</div>;
    if (error) {
        console.error(error);
        return <div>Sorry, there was an error...</div>;
    }

    if (data.myPrayers === null) {
        return <div>Login to create some prayers!</div>;
    }

    if (data.myPrayers.length === 0) {
        return <div>You don't have any prayers yet!</div>;
    }

    return (
        <div>
            This is where the persons prayers are
            <div>
                {data.myPrayers.map((P: Prayer) => (
                    <div>
                        <div>{P.title}</div>
                        <div>{P.body}</div>
                    </div>
                ))}
            </div>
        </div>
    );
    // return <div>Something</div>;
};

export default MyPrayers;
