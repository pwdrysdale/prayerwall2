import React, { useEffect, useState, FormEvent, useCallback } from "react";
import { loader } from "graphql.macro";
import { useMutation, useQuery } from "@apollo/client";
import { RouteComponentProps } from "react-router-dom";

import { List, Photo, PrayerCategory } from "../../types";
import SearchPhotos from "../Photos/SearchPhotos";

const onePrayerQ = loader("./onePrayer.graphql");
const EditPrayerMutation = loader("./EditPrayer.graphql");
const MyPrayerQuery = loader("../MyPrayers/MyPrayers.graphql");
const PublicPrayerQuery = loader("../PublicPrayers/PublicPrayers.graphql");

interface RouteParams {
    id: string;
}

interface Component extends RouteComponentProps<RouteParams> {}

const EditPrayer: React.FC<Component> = ({ match }) => {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [privat, setPrivat] = useState<boolean>(true);
    const [answered, setAnswered] = useState<boolean>(false);
    const [category, setCategory] = useState<number>(0);
    const [selectedLists, setSelectedLists] = useState<number[]>([]);
    const [selectedPhoto, setSelectedPhoto] = useState<Partial<Photo>>({});
    const [photo, setPhoto] = useState<null | Photo>();

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
        console.log(data);
    }, [data]);

    useEffect(() => {
        if (data && data.onePrayer) {
            const { title, body, privat, answered, category, photo } =
                data.onePrayer;
            setTitle(title);
            setBody(body);
            setPrivat(privat);
            setAnswered(answered || false);
            setCategory(category);
            setSelectedLists(data.onePrayer.lists?.map((l: List) => l.id));
            setPhoto(photo && JSON.parse(photo));
            setSelectedPhoto(photo && JSON.parse(photo));
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
                lists: selectedLists,
                photo: JSON.stringify(photo),
            };
            console.log(editPrayerInput);
            editPrayer({
                variables: {
                    editPrayerInput,
                },
            });
        },
        [editPrayer, body, privat, answered, category, id, title, selectedLists]
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
            <div
                style={{
                    backgroundImage: photo?.urls?.regular
                        ? `url(${photo?.urls?.regular})`
                        : "none",
                    height: "100px",
                    width: "100px",
                }}
            ></div>
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
                <SearchPhotos
                    selectedPhoto={selectedPhoto}
                    setSelectedPhoto={setSelectedPhoto}
                />
                {data.myLists.length > 0 ? (
                    <div>
                        <h3>Select the lists you want to add this prayer to</h3>
                        {data.myLists.map((list: any) => {
                            return (
                                <div>
                                    <input
                                        type="checkbox"
                                        id={list.id}
                                        checked={selectedLists.includes(
                                            list.id
                                        )}
                                        onChange={() => {
                                            if (
                                                selectedLists.includes(list.id)
                                            ) {
                                                setSelectedLists(
                                                    selectedLists.filter(
                                                        (id: number) =>
                                                            id !== list.id
                                                    )
                                                );
                                            } else {
                                                setSelectedLists([
                                                    ...selectedLists,
                                                    list.id,
                                                ]);
                                            }
                                        }}
                                    />
                                    <label htmlFor={list.id}>{list.name}</label>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div>
                        <h3>You don't have any lists yet. Create one!</h3>
                    </div>
                )}
                <input type="submit" value="Submit" />
            </form>
        </div>
    );
};

export default EditPrayer;
