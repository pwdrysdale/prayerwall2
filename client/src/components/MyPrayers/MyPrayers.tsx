import { useMutation, useQuery } from "@apollo/client";
import { useEffect } from "react";

import { loader } from "graphql.macro";
import { Prayer, PrayerCategory } from "../../types";
import { Link } from "react-router-dom";
import { useToasts } from "../../store/useToasts";
const myPrayers = loader("./MyPrayers.graphql");
const deletePrayers = loader("./DeletePrayer.graphql");

const MyPrayers = () => {
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
                        <Link to={`/prayer/edit/${P.id}`}>
                            <h2>Edit</h2>
                        </Link>
                        <div>{P.title}</div>
                        <div>{P.body}</div>
                        <div>{P.privat ? "Private" : "Public"}</div>
                        <div>{PrayerCategory[P.category]}</div>
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
