import { useQuery } from "@apollo/client";
import { loader } from "graphql.macro";
import React from "react";
import { useToasts } from "../../store/useToasts";
import { List } from "../../types";

const GET_MY_LISTS = loader("./MyLists.graphql");

const MyLists = () => {
    const { addToast } = useToasts();

    const { loading, data } = useQuery(GET_MY_LISTS, {
        errorPolicy: "all",
        onError: (error) => {
            addToast({ message: error.message, type: "error" });
        },
    });

    if (loading) {
        return <div>Loading...</div>;
    }

    if (data) {
        return (
            <div>
                <h1>My Lists</h1>
                {data.myLists?.map((list: List) => {
                    return (
                        <div key={list.id}>
                            <h1>{list.name}</h1>
                            <div>{list.description}</div>
                            <div>{list.privat ? "Private" : "Public"}</div>
                        </div>
                    );
                })}
            </div>
        );
    }

    return <div>Sorry, there was an error</div>;
};

export default MyLists;
