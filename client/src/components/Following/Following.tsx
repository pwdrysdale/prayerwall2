import { useMutation, useQuery } from "@apollo/client";
import React from "react";
import { loader } from "graphql.macro";
import { User } from "../../types";
import { useToasts } from "../../store/useToasts";
import Button from "../HTML/Button";

const FOLLOWING_QUERY = loader("./Following.graphql");
const UNFOLLOW_MUTATION = loader("./Unfollow.graphql");

const Following = () => {
    const { addToast } = useToasts();

    const { data, loading, error } = useQuery(FOLLOWING_QUERY, {
        errorPolicy: "all",
        onError: (error) => {
            if (
                error.message ===
                "Access denied! You don't have permission for this action!"
            ) {
                addToast({
                    message:
                        "Access denied! You don't have permission for this action!",
                    type: "error",
                });
            }
        },
    });

    const [unfollow] = useMutation(UNFOLLOW_MUTATION, {
        onError: (error) => {
            addToast({ message: "There was an error", type: "error" });
        },
    });

    React.useEffect(() => {
        console.log(data);
    }, [data]);

    if (loading) return <div>Loading...</div>;

    if (
        error?.message ===
        "Access denied! You don't have permission for this action!"
    ) {
        return <div>Login to see who you follow!</div>;
    }

    if (error) return <div>Sorry, there was an error...</div>;

    return (
        <div>
            <h1>People I'm Following</h1>
            {data.getMyFollowers?.map((user: User) => (
                <div key={user.id}>
                    <h3>{user.username}</h3>
                    <Button
                        onClick={() =>
                            unfollow({
                                variables: {
                                    id:
                                        typeof user.id === "string"
                                            ? parseFloat(user.id)
                                            : user.id,
                                },
                                awaitRefetchQueries: true,
                                refetchQueries: [{ query: FOLLOWING_QUERY }],
                            })
                        }
                    >
                        Unfollow
                    </Button>
                </div>
            ))}
        </div>
    );
};

export default Following;
