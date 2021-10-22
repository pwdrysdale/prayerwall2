import React from "react";

import { loader } from "graphql.macro";
import { Prayer } from "../../types";
import { useQuery } from "@apollo/client";
import moment from "moment";
import Button from "../HTML/Button";
import { Link } from "react-router-dom";
const publicPrayers = loader("./PublicPrayers.graphql");

const PublicPrayers = () => {
    const { data, loading, error, refetch } = useQuery(publicPrayers, {
        errorPolicy: "all",
        variables: { cursor: "" },
    });

    // const next = () => {
    //     const cursor: string = data.publicPrayers[data.publicPrayers.length - 1].createdDate

    //     const { data: newData } = useQuery(publicPrayers,{errorPolicy: 'all', variables: {cursor}})

    //     return

    // }

    // React.useEffect(() => {
    //     console.log(data);
    // }, [data]);

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
                        <div>{P.user?.username}</div>
                        {data.me && P.user?.id === data.me?.id && (
                            <h2>Delete</h2>
                        )}
                        <div>{P.title}</div>
                        <div>{P.body}</div>
                        <div>{P.privat ? "Private" : "Public"}</div>
                        <div>{P.category}</div>
                        <div>
                            {P.answered ? "Answered" : "Not answered yet"}
                        </div>
                        <div>{P.comments.length} Comments</div>
                        <div>{moment(P.createdDate).format("LLLL")}</div>
                        <Link to={`/prayer/addcomment/${P.id}`}>
                            <h1>Add a comment</h1>
                        </Link>
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
