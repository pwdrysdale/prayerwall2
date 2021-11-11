import React from "react";

import { loader } from "graphql.macro";
import { List, Prayer } from "../../types";
import { useMutation, useQuery } from "@apollo/client";
import Button from "../HTML/Button";
import { Link } from "react-router-dom";
import { useToasts } from "../../store/useToasts";
import RenderPrayer from "../RenderPrayer/RenderPrayer";
const publicPrayers = loader("./PublicPrayers.graphql");
const addToListMutation = loader("./AddToList.graphql");

const PublicPrayers = () => {
    const { addToast } = useToasts();

    const { data, loading, error, refetch } = useQuery(publicPrayers, {
        errorPolicy: "all",
        variables: { cursor: "" },
        onError: (error) => {
            addToast({ type: "error", message: error.message });
        },
    });

    const [addToList] = useMutation(addToListMutation, {
        awaitRefetchQueries: true,
        refetchQueries: [{ query: publicPrayers }],
        errorPolicy: "all",
        onError: () => {
            addToast({
                type: "error",
                message: "Could not add prayer to list. Sorry. ",
            });
        },
    });

    React.useEffect(() => {
        console.log(data);
    }, [data]);

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
                        <RenderPrayer prayer={P} me={data.me} />

                        {data.me?.id ? (
                            <>
                                {data.me.lists.length === 0 ? (
                                    <div>
                                        Create a list so you can add prayers to
                                        it!
                                    </div>
                                ) : (
                                    data.me.lists.map((l: List) => (
                                        <div key={l.id}>
                                            <div>{l.name}</div>
                                            <Button
                                                title="Add to List"
                                                onClick={() =>
                                                    addToList({
                                                        variables: {
                                                            addPrayerToListInputs:
                                                                {
                                                                    listId:
                                                                        typeof l.id ===
                                                                        "string"
                                                                            ? parseFloat(
                                                                                  l.id
                                                                              )
                                                                            : l.id,
                                                                    prayerId:
                                                                        typeof P.id ===
                                                                        "string"
                                                                            ? parseFloat(
                                                                                  P.id
                                                                              )
                                                                            : P.id,
                                                                },
                                                        },
                                                    })
                                                }
                                            ></Button>
                                        </div>
                                    ))
                                )}
                            </>
                        ) : (
                            <div>
                                You register that you have prayed for this, and
                                comment on this by logging in!
                            </div>
                        )}
                    </div>
                ))}
                <Button
                    title="Next"
                    onClick={() => {
                        const cursor: string =
                            data.publicPrayers[data.publicPrayers.length - 1]
                                .createdDate;
                        refetch({
                            cursor,
                        });
                    }}
                />
            </div>
        </div>
    );
    // return <div>Something</div>;
};

export default PublicPrayers;
