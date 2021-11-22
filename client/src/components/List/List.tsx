import React, { useEffect } from "react";
import { RouteComponentProps, Redirect } from "react-router-dom";
import { loader } from "graphql.macro";
import { useMutation, useQuery } from "@apollo/client";
import { Prayer } from "../../types";
import Button from "../HTML/Button";
import Card from "../UserCards/Card";

const LIST_QUERY = loader("./getSingleList.graphql");
const GET_LISTS_QUERY = loader("../MyLists/MyLists.graphql");
const DELETE_LIST_MUTATION = loader("./deleteList.graphql");

interface RouteParams {
    id: string;
}

interface Component extends RouteComponentProps<RouteParams> {}

const List: React.FC<Component> = ({ match }) => {
    const id = match.params.id;

    const { loading, error, data } = useQuery(LIST_QUERY, {
        variables: {
            singleListId: typeof id === "string" ? parseFloat(id) : id,
        },
    });

    const [deleteList, { data: listDeleted }] = useMutation(
        DELETE_LIST_MUTATION,
        {
            variables: {
                id: parseFloat(id),
            },
            refetchQueries: [{ query: GET_LISTS_QUERY }],
        }
    );

    if (loading) return <p>Loading...</p>;

    if (error) return <p>Error :(</p>;

    if (listDeleted) return <Redirect to="/lists" />;

    return (
        <div>
            <h1>{data.singleList.name}</h1>
            <p>{data.singleList.description}</p>
            <Button onClick={() => deleteList()}>Delete List</Button>
            {data.singleList.privat ? <p>Private</p> : <p>Public</p>}
            <h3>Prayers In This List</h3>
            {data.singleList.prayers.map((prayer: Prayer, idx: number) => (
                <div key={idx}>
                    <h3>{prayer.title}</h3>
                    <p>{prayer.body}</p>
                    <Card
                        img={prayer.user.image}
                        username={prayer.user.username}
                    />
                </div>
            ))}
        </div>
    );
};

export default List;
