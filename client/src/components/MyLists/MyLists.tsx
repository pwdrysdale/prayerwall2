import { useQuery } from "@apollo/client";
import { loader } from "graphql.macro";
import React from "react";
import { Link } from "react-router-dom";
import { useToasts } from "../../store/useToasts";
import { List, Prayer } from "../../types";
import Button from "../HTML/Button";
import MyListsListItem from "./MyListsListItem";

const GET_MY_LISTS = loader("./MyLists.graphql");

const MyLists = () => {
    const { addToast } = useToasts();

    const { loading, data } = useQuery(GET_MY_LISTS, {
        errorPolicy: "all",
        onError: (error) => {
            addToast({ message: error.message, type: "error" });
        },
    });

    React.useEffect(() => {
        console.log(data);
    }, [data]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (data) {
        return (
            <div>
                <h1>My Lists</h1>
                <Link to="/lists/add">
                    <Button title="Create a new list" />
                </Link>
                {data.myLists?.map((list: List) => (
                    <MyListsListItem key={list.id} list={list} />
                ))}
            </div>
        );
    }

    return <div>Sorry, there was an error</div>;
};

export default MyLists;
