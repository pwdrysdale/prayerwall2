import { useMutation } from "@apollo/client";
import React, { FormEvent, useCallback, useRef } from "react";

import { loader } from "graphql.macro";
import { PrayerCategory } from "../../types";
const AddPrayerMutation = loader("./AddPrayer.graphql");
const MyPrayerQuery = loader("../MyPrayers/MyPrayers.graphql");
const PublicPrayerQuery = loader("../PublicPrayers/PublicPrayers.graphql");

const AddPrayer = () => {
    const titleRef = useRef<HTMLInputElement>(null);
    const bodyRef = useRef<HTMLInputElement>(null);
    const privateRef = useRef<HTMLInputElement>(null);
    const answeredRef = useRef<HTMLInputElement>(null);
    const categoryRef = useRef<HTMLSelectElement>(null);

    const [addPrayer] = useMutation(AddPrayerMutation, {
        awaitRefetchQueries: true,
        refetchQueries: [
            { query: MyPrayerQuery },
            { query: PublicPrayerQuery, variables: { cursor: "" } },
        ],
    });
    const onSubmit = useCallback(
        (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            if (
                bodyRef.current &&
                titleRef.current &&
                privateRef.current &&
                answeredRef.current &&
                categoryRef.current
            ) {
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
                            privat: privateRef.current.checked,
                            answered: answeredRef.current.checked,
                            category: categoryRef.current
                                .value as PrayerCategory,
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
                <div className="form-group">
                    <label htmlFor="private">Private</label>
                    <input
                        type="checkbox"
                        name="private"
                        id="private"
                        ref={privateRef}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="answered">Answered</label>
                    <input
                        type="checkbox"
                        name="answered"
                        id="answered"
                        ref={answeredRef}
                    />
                </div>
                <div className="form-group">
                    <select name="category" id="category" ref={categoryRef}>
                        {Object.keys(PrayerCategory).map((o: string) => (
                            <option key={o}>{o}</option>
                        ))}
                    </select>
                </div>
                <input type="submit" value="Submit" />
            </form>
        </div>
    );
};

export default AddPrayer;