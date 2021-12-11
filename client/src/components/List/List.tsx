import React, { useEffect, useState } from "react";
import { RouteComponentProps, Redirect } from "react-router-dom";
import { loader } from "graphql.macro";
import { useMutation, useQuery } from "@apollo/client";
import { Photo, Prayer } from "../../types";
import Button from "../HTML/Button";
import Card from "../UserCards/Card";
import RenderPrayer from "../RenderPrayer/RenderPrayer";
import { useToasts } from "../../store/useToasts";
import { userInfo } from "../../store/userInfo";

const LIST_QUERY = loader("./getSingleList.graphql");
const GET_LISTS_QUERY = loader("../MyLists/MyLists.graphql");
const DELETE_LIST_MUTATION = loader("./deleteList.graphql");

interface RouteParams {
    id: string;
}

interface Component extends RouteComponentProps<RouteParams> {}

const List: React.FC<Component> = ({ match }) => {
    const id = match.params.id;
    const { addToast } = useToasts();
    const { user } = userInfo();

    const [photo, setPhoto] = useState<null | Photo>();

    const { loading, error, data } = useQuery(LIST_QUERY, {
        variables: {
            singleListId: typeof id === "string" ? parseFloat(id) : id,
        },
        onError: (err) => {
            addToast({ message: err.message, type: "error" });
        },
        onCompleted: (data) => {
            setPhoto(JSON.parse(data.singleList.photo));
        },
    });

    useEffect(() => {
        console.log(data);
    }, [data]);

    const [deleteList, { data: listDeleted }] = useMutation(
        DELETE_LIST_MUTATION,
        {
            variables: {
                id: parseFloat(id),
            },
            refetchQueries: [{ query: GET_LISTS_QUERY }],
        }
    );

    if (!user.id) {
        <Redirect to="/" />;
    }

    if (loading) return <p>Loading...</p>;

    if (error) return <p>Error :(</p>;

    if (listDeleted) return <Redirect to="/lists" />;

    return (
        <div>
            <h1>{data.singleList?.name}</h1>
            <p>{data.singleList?.description}</p>
            {photo?.id && <img src={photo?.urls?.regular} alt="" />}
            <Button onClick={() => deleteList()}>Delete List</Button>
            {data.singleList.privat ? <p>Private</p> : <p>Public</p>}
            <h3>Prayers In This List</h3>
            <div className="prayerContainer">
                {data.singleList.prayers.map((prayer: Prayer, idx: number) => (
                    <RenderPrayer me={data.me} prayer={prayer} key={idx} />
                ))}
            </div>
        </div>
    );
};

export default List;
