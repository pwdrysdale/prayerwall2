import React from "react";

import { loader } from "graphql.macro";
import { Following, Prayer, PrayerCategory } from "../../types";
import { useMutation, useQuery } from "@apollo/client";
import moment from "moment";
import Button from "../HTML/Button";
import { Link } from "react-router-dom";
import { useToasts } from "../../store/useToasts";
const publicPrayers = loader("./PublicPrayers.graphql");
const deletePrayerMutation = loader("../MyPrayers/deletePrayer.graphql");
const prayedMutation = loader("./Prayed.graphql");
const followMutation = loader("./Follow.graphql");

const PublicPrayers = () => {
    const { addToast } = useToasts();

    const { data, loading, error, refetch } = useQuery(publicPrayers, {
        errorPolicy: "all",
        variables: { cursor: "" },
        onError: (error) => {
            addToast({ type: "error", message: error.message });
        },
    });

    const [deletePrayer, { loading: deleteLoading }] = useMutation(
        deletePrayerMutation,
        {
            awaitRefetchQueries: true,
            refetchQueries: [{ query: publicPrayers }],
        }
    );

    const [prayed, { loading: prayedLoading }] = useMutation(prayedMutation, {
        awaitRefetchQueries: true,
        refetchQueries: [{ query: publicPrayers }],
    });

    const [follow] = useMutation(followMutation, {
        awaitRefetchQueries: true,
        refetchQueries: [{ query: publicPrayers }],
    });

    // const next = () => {
    //     const cursor: string = data.publicPrayers[data.publicPrayers.length - 1].createdDate

    //     const { data: newData } = useQuery(publicPrayers,{errorPolicy: 'all', variables: {cursor}})

    //     return

    // }

    React.useEffect(() => {
        console.log(data);
    }, [data]);

    if (loading || deleteLoading || prayedLoading) return <div>Loading...</div>;
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
                        <div>{P.user?.username}</div>
                        <h3>{P.title}</h3>
                        <div>{P.body}</div>
                        <div>{P.privat ? "Private" : "Public"}</div>
                        <div>{PrayerCategory[P.category]}</div>
                        <div>
                            {P.answered ? "Answered" : "Not answered yet"}
                        </div>
                        <div>{P.comments.length} Comments</div>
                        <div>Prayed {P.prayedBy?.length} times</div>
                        <div>{moment(P.createdDate).format("LLLL")}</div>
                        {data.me?.id ? (
                            <>
                                <div>Prayed by you {P.prayedByUser} times</div>

                                {data.me.id !== P.user.id &&
                                !data.me.createdFollows
                                    .map((f: Following) => f.followingId.id)
                                    .includes(P.user.id) ? (
                                    <Button
                                        onClick={async () => {
                                            const value = await follow({
                                                variables: {
                                                    id:
                                                        typeof P.user.id ===
                                                        "string"
                                                            ? parseFloat(
                                                                  P.user.id
                                                              )
                                                            : P.user.id,
                                                },
                                            });
                                            if (value) {
                                                addToast({
                                                    type: "success",
                                                    message: "Followed!",
                                                });
                                            }
                                        }}
                                    >
                                        Follow
                                    </Button>
                                ) : (
                                    data.me.id !== P.user.id && (
                                        <div>
                                            You already follow this person!
                                        </div>
                                    )
                                )}
                                <Link
                                    to={`/prayer/addcomment/${
                                        typeof P.id === "string"
                                            ? parseFloat(P.id)
                                            : P.id
                                    }`}
                                >
                                    <Button>Add a comment</Button>
                                </Link>
                                <Button
                                    onClick={() => {
                                        prayed({
                                            variables: {
                                                id:
                                                    typeof P.id === "string"
                                                        ? parseFloat(P.id)
                                                        : P.id,
                                            },
                                        });
                                    }}
                                >
                                    Prayed just now
                                </Button>
                                {data.me && P.user?.id === data.me?.id && (
                                    <>
                                        <Button
                                            onClick={() => {
                                                deletePrayer({
                                                    variables: {
                                                        id:
                                                            typeof P.id ===
                                                            "string"
                                                                ? parseFloat(
                                                                      P.id
                                                                  )
                                                                : P.id,
                                                    },
                                                });
                                            }}
                                        >
                                            Delete Prayer
                                        </Button>
                                        <Link to={`/prayer/edit/${P.id}`}>
                                            <Button>Edit</Button>
                                        </Link>
                                    </>
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
