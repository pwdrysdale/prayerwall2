import React from "react";

import { loader } from "graphql.macro";
import { Prayer } from "../../types";
import { useQuery } from "@apollo/client";
import Button from "../HTML/Button";
import { useToasts } from "../../store/useToasts";
import RenderPrayer from "../RenderPrayer/RenderPrayer";
const publicPrayers = loader("./PublicPrayers.graphql");

const PublicPrayers = () => {
    const { addToast } = useToasts();

    const { data, loading, error, refetch } = useQuery(publicPrayers, {
        errorPolicy: "all",
        variables: { cursor: "" },
        onError: (error) => {
            addToast({ type: "error", message: error.message });
        },
        onCompleted: (data) => {
            console.log(data);
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
};

export default PublicPrayers;
