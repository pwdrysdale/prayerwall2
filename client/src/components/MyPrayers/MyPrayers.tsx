import { useMutation, useQuery } from "@apollo/client";
import { useEffect } from "react";

import { loader } from "graphql.macro";
import { Prayer, PrayerCategory } from "../../types";
import { Link } from "react-router-dom";
import { useToasts } from "../../store/useToasts";
import Button from "../HTML/Button";

const myPrayers = loader("./MyPrayers.graphql");
const deletePrayers = loader("./DeletePrayer.graphql");
const setAsPrayed = loader("../PublicPrayers/Prayed.graphql");

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

    const [prayedThis] = useMutation(setAsPrayed, {
        onError: (error) => {
            addToast({
                message: "Sorry, we could not make that update :(",
                type: "error",
            });
        },
        refetchQueries: [{ query: myPrayers }],
        awaitRefetchQueries: true,
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
                        <h1>{P.title}</h1>
                        <div>{P.body}</div>
                        <div>{P.privat ? "Private" : "Public"}</div>
                        <div>{PrayerCategory[P.category]}</div>
                        <div>
                            {P.answered ? "Answered" : "Not answered yet"}
                        </div>
                        <div>
                            {P.prayedBy && P.prayedBy.length > 0
                                ? P.prayedBy.length
                                : "No one prayed yet"}
                        </div>
                        <Button
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
                        </Button>
                        <Link to={`/prayer/edit/${P.id}`}>
                            <Button>Edit</Button>
                        </Link>
                        <Button
                            onClick={() => {
                                prayedThis({
                                    variables: {
                                        id: P.id,
                                    },
                                });
                            }}
                        >
                            I Prayed This Prayer
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
    // return <div>Something</div>;
};

export default MyPrayers;
