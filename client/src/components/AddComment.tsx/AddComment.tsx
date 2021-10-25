import { useMutation, useQuery } from "@apollo/client";
import React, { FormEvent, useState, useEffect } from "react";
import { RouteComponentProps } from "react-router-dom";
import { loader } from "graphql.macro";
import { PrayerComments } from "../../types";
import moment from "moment";

const onePrayerQ = loader("./getForComment.graphql");
const addComm = loader("./AddComment.graphql");

interface RouteParams {
    id: string;
}

interface Component extends RouteComponentProps<RouteParams> {}

const AddComment: React.FC<Component> = ({ match }) => {
    const { id } = match.params;

    const [newComment, setNewComment] = useState("");
    const [privat, setPrivat] = useState(false);

    const { data, error, loading } = useQuery(onePrayerQ, {
        errorPolicy: "all",
        variables: {
            id: parseFloat(id),
        },
    });

    const [addComment] = useMutation(addComm, {
        refetchQueries: [
            { query: onePrayerQ, variables: { id: parseFloat(id) } },
        ],
        awaitRefetchQueries: true,
    });

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Adding a comment or something");
        const prayerCommentInput = {
            body: newComment,
            prayerId: parseFloat(id),
            privat,
        };
        console.log(prayerCommentInput);
        addComment({ variables: { prayerCommentInput } });
    };

    useEffect(() => {
        console.log(data);
    }, [data]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Sorry, there was an error...</div>;
    if (data && data.onePrayer) {
        const { title, body, category, comments } = data.onePrayer;
        return (
            <div>
                <h1>{title}</h1>
                <div>{body}</div>
                <div>{category}</div>
                {!data.me ? (
                    <div>You need to login to post comments! </div>
                ) : (
                    <form onSubmit={onSubmit}>
                        <div className="form-group">
                            <div>Commenting as {data.me.username}</div>
                            <label htmlFor="newcomment">Comment: </label>
                            <input
                                type="text"
                                name=""
                                id="newcomment"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="private">Private</label>
                            <input
                                type="checkbox"
                                name="private"
                                id="privat"
                                checked={privat}
                                onChange={() => setPrivat(!privat)}
                            />
                        </div>
                        <input type="submit" value="Submit" />
                    </form>
                )}

                <div>
                    {comments.length === 0
                        ? "This prayer does not have any comments on it yet. Be the first to add one!"
                        : comments.map((c: PrayerComments, idx: number) => (
                              <div key={idx}>
                                  <div>
                                      {c.user?.username} on{" "}
                                      {moment(c.createdDate).format("LLLL")}
                                  </div>
                                  <div>{c.body}</div>
                              </div>
                          ))}
                </div>
            </div>
        );
    }
    return <div>Sorry, there was an error...</div>;
};

export default AddComment;
