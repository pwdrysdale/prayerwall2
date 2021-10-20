import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { useEffect } from "react";

import { loader } from "graphql.macro";
import { Prayer } from "../../types";
const myPrayers = loader("./MyPrayers.graphql");
const deletePrayers = loader("./DeletePrayer.graphql");
const onePrayerQ = loader("./onePrayer.graphql");

const MyPrayers = () => {
    const { data, loading, error } = useQuery(myPrayers, {
        errorPolicy: "all",
    });

    const [onePrayer, { data: onePrayerData }] = useLazyQuery(onePrayerQ, {
        errorPolicy: "all",
    });

    useEffect(() => {
        console.log(onePrayerData);
    }, [onePrayerData]);

    const [deletePrayer] = useMutation(deletePrayers, {
        errorPolicy: "all",
        refetchQueries: [{ query: myPrayers }],
        awaitRefetchQueries: true,
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
            <h1>My Prayers</h1>
            <div>
                {data.myPrayers.map((P: Prayer, idx: number) => (
                    <div key={idx}>
                        <h2
                            onClick={() => {
                                deletePrayer({
                                    variables: {
                                        id:
                                            typeof P.id === "string"
                                                ? parseFloat(P.id)
                                                : P.id,
                                    },
                                });
                            }}
                        >
                            Delete
                        </h2>
                        <h2
                            onClick={() => {
                                onePrayer({
                                    variables: {
                                        id:
                                            typeof P.id === "string"
                                                ? parseFloat(P.id)
                                                : P.id,
                                    },
                                });
                            }}
                        >
                            Edit
                        </h2>
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

export default MyPrayers;
