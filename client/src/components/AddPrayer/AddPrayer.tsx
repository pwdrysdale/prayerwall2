import { useMutation } from "@apollo/client";
import React, { FormEvent, useCallback, useRef } from "react";

import { loader } from "graphql.macro";
const AddPrayerMutation = loader("./AddPrayer.graphql");
const MyPrayerQuery = loader("../MyPrayers/MyPrayers.graphql");

const AddPrayer = () => {
    const titleRef = useRef<HTMLInputElement>(null);
    const bodyRef = useRef<HTMLInputElement>(null);

    const [addPrayer] = useMutation(AddPrayerMutation, {
        awaitRefetchQueries: true,
        refetchQueries: [{ query: MyPrayerQuery }],
    });
    const onSubmit = useCallback(
        (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            if (bodyRef.current && titleRef.current) {
                console.log(
                    "Body: ",
                    bodyRef.current.value,
                    "Title: ",
                    titleRef.current.value
                );
                addPrayer({
                    variables: {
                        prayerInput: {
                            title: titleRef.current.value,
                            body: bodyRef.current.value,
                        },
                    },
                });
            }
        },
        [addPrayer]
    );

    return (
        <div>
            Add a prayer here
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Title:</label>
                    <input type="text" id="title" ref={titleRef} />
                </div>
                <div className="form-group">
                    <label htmlFor="body">Body:</label>
                    <input type="text" id="body" ref={bodyRef} />
                </div>
                <input type="submit" value="Submit" />
            </form>
        </div>
    );
};

export default AddPrayer;
