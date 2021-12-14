import { FC, FormEvent, useState } from "react";
import { loader } from "graphql.macro";
import { useMutation, useQuery } from "@apollo/client";
import { RouteComponentProps, Redirect } from "react-router-dom";
import { useToasts } from "../../store/useToasts";
import SearchPhotos from "../Photos/SearchPhotos";
import Button from "../HTML/Button";
import { userInfo } from "../../store/userInfo";

const GET_LIST = loader("../List/getSingleList.graphql");
const EDIT_LIST = loader("./editList.graphql");

interface RouteParams {
    id: string;
}

interface Component extends RouteComponentProps<RouteParams> {}

const EditList: FC<Component> = ({ match }) => {
    const id = match.params.id;
    const [redirect, setRedirect] = useState(false);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [privat, setPrivat] = useState(false);
    const [photo, setPhoto] = useState({});

    const { addToast } = useToasts();
    const { user } = userInfo();

    const { loading, error, data } = useQuery(GET_LIST, {
        variables: {
            singleListId: typeof id === "string" ? parseFloat(id) : id,
        },
        onCompleted: (data) => {
            console.log("Single List: ", data.singleList);
            if (!data.singleList) {
                console.log("List not found");
                setRedirect(true);
            } else {
                setName(data.singleList.name);
                setDescription(data.singleList.description);
                setPrivat(data.singleList.privat);
                setPhoto(data.singleList.photo);
            }
        },
    });

    const [editList] = useMutation(EDIT_LIST, {
        errorPolicy: "all",
        onError: (error) => {
            setRedirect(true);
            addToast({ message: error.message, type: "error" });
        },
    });

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        editList({
            variables: {
                editListInput: {
                    name,
                    description,
                    privat,
                    photo: JSON.stringify(photo),
                    id: parseFloat(id),
                },
            },
            onCompleted: () => {
                addToast({ message: "List edited!", type: "success" });
            },
        });
    };

    if (redirect) {
        // addToast({ message: "In redirect", type: "error" });
        return <Redirect to="/login" />;
    } else if (loading) {
        return <div>Loading...</div>;
    } else {
        return (
            <div>
                <h1>Edit List - {name}</h1>
                <form onSubmit={onSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="privat">Private: </label>
                        <input
                            type="checkbox"
                            id="privat"
                            checked={privat}
                            onChange={(e) => setPrivat(!privat)}
                        />
                    </div>
                    <div>
                        <SearchPhotos
                            selectedPhoto={photo}
                            setSelectedPhoto={setPhoto}
                        />
                    </div>
                    <Button type="submit">Submit</Button>
                </form>
            </div>
        );
    }
};
export default EditList;
