import { useQuery } from "@apollo/client";
import { loader } from "graphql.macro";
import React from "react";
import { useToasts } from "../../store/useToasts";
import { List, Prayer } from "../../types";

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
                {data.myLists?.map((list: List) => {
                    return (
                        <div key={list.id}>
                            <h1>{list.name}</h1>
                            <div>{list.description}</div>
                            <div>{list.length}</div>
                            <div>{list.privat ? "Private" : "Public"}</div>

                            {!list.prayers.length ? (
                                <div>This list is empty </div>
                            ) : (
                                <div>
                                    <h2>Prayers</h2>
                                    {list.prayers.map((P: Prayer) => {
                                        return (
                                            <div key={P.id}>
                                                {P.title}
                                                {P.body}
                                                {P.user.username}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    }

    return <div>Sorry, there was an error</div>;
};

export default MyLists;
