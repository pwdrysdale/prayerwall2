import React, { useEffect, useState, FormEvent, useCallback } from "react";
import { loader } from "graphql.macro";
import { useMutation, useQuery } from "@apollo/client";
import { RouteComponentProps } from "react-router-dom";

import { PrayerCategory } from "../../types";

const onePrayerQ = loader("./onePrayer.graphql");
const EditPrayerMutation = loader("./EditPrayer.graphql");
const MyPrayerQuery = loader("../MyPrayers/MyPrayers.graphql");
const PublicPrayerQuery = loader("../PublicPrayers/PublicPrayers.graphql");

interface RouteParams {
    id: string;
}

interface Component extends RouteComponentProps<RouteParams> {}

const EditPrayer: React.FC<Component> = ({ match }) => {
    // const titleRef = useRef<HTMLInputElement>(null);
    // const bodyRef = useRef<HTMLInputElement>(null);
    // const privateRef = useRef<HTMLInputElement>(null);
    // const answeredRef = useRef<HTMLInputElement>(null);
    // const categoryRef = useRef<HTMLSelectElement>(null);
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [privat, setPrivat] = useState<boolean>(true);
    const [answered, setAnswered] = useState<boolean>(false);
    const [category, setCategory] = useState<PrayerCategory>(
        PrayerCategory.thanks
    );

    const { id } = match.params;

    const { data, error, loading } = useQuery(onePrayerQ, {
        errorPolicy: "all",
        variables: {
            id: parseFloat(id),
        },
    });
    const [editPrayer] = useMutation(EditPrayerMutation, {
        awaitRefetchQueries: true,
        refetchQueries: [
            { query: MyPrayerQuery },
            { query: PublicPrayerQuery, variables: { cursor: "" } },
        ],
    });

    useEffect(() => {
        if (data && data.onePrayer) {
            const { title, body, privat, answered, category } = data.onePrayer;
            setTitle(title);
            setBody(body);
            setPrivat(privat);
            setAnswered(answered || false);
            setCategory(PrayerCategory[category] as unknown as PrayerCategory);
        }
    }, [data]);

    const onSubmit = useCallback(
        (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const editPrayerInput = {
                id: parseFloat(id),
                title,
                body,
                privat,
                answered,
                category:
                    typeof category === "string"
                        ? parseFloat(category)
                        : category,
            };

            editPrayer({
                variables: {
                    editPrayerInput,
                },
            });
        },
        [editPrayer, body, privat, answered, category, id, title]
    );

    if (loading) {
        return <div>Loading...</div>;
    }
    if (error) {
        return <div>Sorry, there was an error...</div>;
    }

    return (
        <div>
            Edit a prayer here
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Title:</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="body">Body:</label>
                    <input
                        type="text"
                        id="body"
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="private">Private</label>
                    <input
                        type="checkbox"
                        name="private"
                        id="private"
                        checked={privat}
                        onChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                        ): void => setPrivat(e.target.checked)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="answered">Answered</label>
                    <input
                        type="checkbox"
                        name="answered"
                        id="answered"
                        checked={answered}
                        onChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                        ): void => setAnswered(e.target.checked)}
                    />
                </div>
                <div className="form-group">
                    <select
                        name="category"
                        id="category"
                        value={category}
                        onChange={(e) =>
                            setCategory(
                                e.target.value as unknown as PrayerCategory
                            )
                        }
                    >
                        {Object.values(PrayerCategory)
                            .filter(
                                (o: string | number) => typeof o === "number"
                            )
                            .map((o: any) => {
                                return (
                                    <option key={o} value={o}>
                                        {PrayerCategory[o]}
                                    </option>
                                );
                            })}
                    </select>
                </div>
                <input type="submit" value="Submit" />
            </form>
        </div>
    );
};

export default EditPrayer;
