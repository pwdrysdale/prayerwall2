import React from "react";

import { loader } from "graphql.macro";
import { Prayer } from "../../types";
import { useMutation, useQuery } from "@apollo/client";
import moment from "moment";
import Button from "../HTML/Button";
import { Link } from "react-router-dom";
import { useToasts } from "../../store/useToasts";
const publicPrayers = loader("./PublicPrayers.graphql");
const deletePrayerMutation = loader("../MyPrayers/deletePrayer.graphql");
const prayedMutation = loader("./Prayed.graphql");

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
                        {data.me && P.user?.id === data.me?.id && (
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
                                Delete Prayer
                            </h2>
                        )}
                        <h3>{P.title}</h3>
                        <div>{P.body}</div>
                        <div>{P.privat ? "Private" : "Public"}</div>
                        <div>{P.category}</div>
                        <div>
                            {P.answered ? "Answered" : "Not answered yet"}
                        </div>
                        <div>{P.comments.length} Comments</div>
                        <div>Prayed {P.prayedBy.length} times</div>
                        <div>Prayed by you {P.prayedByUser} times</div>
                        <div>{moment(P.createdDate).format("LLLL")}</div>
                        {data.me?.id ? (
                            <>
                                <Link
                                    to={`/prayer/addcomment/${
                                        typeof P.id === "string"
                                            ? parseFloat(P.id)
                                            : P.id
                                    }`}
                                >
                                    <h1>Add a comment</h1>
                                </Link>
                                <h1
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
                                </h1>
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
