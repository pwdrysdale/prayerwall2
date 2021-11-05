import { useMutation } from "@apollo/client";
import { loader } from "graphql.macro";
import React from "react";
import { useToasts } from "../../store/useToasts";
import Button from "../HTML/Button";

const ADD_LIST = loader("./addList.graphql");

const AddList = () => {
    const [name, setName] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [privat, setPrivat] = React.useState(false);

    const { addToast } = useToasts();

    const [addList] = useMutation(ADD_LIST, {
        errorPolicy: "all",
        onError: (error) => {
            addToast({ message: error.message, type: "error" });
        },
    });

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Going to submit");
        addList({
            variables: {
                listInput: {
                    name,
                    description,
                    privat,
                },
            },
        });
    };

    return (
        <div>
            <h1>Add A List</h1>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name: </label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description: </label>
                    <input
                        type="text"
                        id="description"
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
                <Button type="submit">Submit</Button>
            </form>
        </div>
    );
};

export default AddList;
