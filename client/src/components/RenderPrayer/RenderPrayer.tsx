import { useMutation } from "@apollo/client";
import { loader } from "graphql.macro";
import moment from "moment";
import React from "react";
import { Link } from "react-router-dom";
import { useToasts } from "../../store/useToasts";
import { Following, Prayer, PrayerCategory, User } from "../../types";
import Button from "../HTML/Button";
import Card from "../UserCards/Card";
import styles from "./RenderPrayer.module.css";

const followMutation = loader("../PublicPrayers/Follow.graphql");
const publicPrayers = loader("../PublicPrayers/PublicPrayers.graphql");
const deletePrayerMutation = loader("../MyPrayers/deletePrayer.graphql");
const prayedMutation = loader("../PublicPrayers/Prayed.graphql");

const RenderPrayer = ({ prayer, me }: { prayer: Prayer; me: User }) => {
    const owner = me?.id === prayer.user.id;

    const [prayed] = useMutation(prayedMutation, {
        awaitRefetchQueries: true,
        refetchQueries: [{ query: publicPrayers }],
    });

    return (
        <div className={styles.card}>
            <div>
                <Card
                    img={prayer.user.image}
                    username={prayer.user.username}
                    link={`/user/${prayer.user.id}`}
                />
                <FollowButton prayer={prayer} me={me} />
            </div>
            <div>
                <h1>{prayer.title}</h1>
                <div>{PrayerCategory[prayer.category]}</div>
                {owner ? "Owner" : "Not owner"}
                {prayer.answered ? "Answered!" : "Not answered"}
                <p>{prayer.body}</p>
                <div className={styles.vis_detail}>
                    <div>{moment(prayer.createdDate).format("LLLL")}</div>
                    <div>{prayer.comments.length} comments</div>
                    {me && (
                        <Link
                            to={`/prayer/addcomment/${
                                typeof prayer.id === "string"
                                    ? parseFloat(prayer.id)
                                    : prayer.id
                            }`}
                        >
                            <Button>Add a comment</Button>
                        </Link>
                    )}
                    {me && (
                        <>
                            <div>
                                {" "}
                                Prayed by you {prayer.prayedByUser} times
                            </div>
                            <Button
                                onClick={() => {
                                    prayed({
                                        variables: {
                                            id:
                                                typeof prayer.id === "string"
                                                    ? parseFloat(prayer.id)
                                                    : prayer.id,
                                        },
                                    });
                                }}
                            >
                                Prayed just now
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

const FollowButton = ({ me, prayer }: { me: User; prayer: Prayer }) => {
    const { addToast } = useToasts();

    const [follow] = useMutation(followMutation, {
        awaitRefetchQueries: true,
        refetchQueries: [{ query: publicPrayers }],
    });

    const [deletePrayer] = useMutation(deletePrayerMutation, {
        awaitRefetchQueries: true,
        refetchQueries: [{ query: publicPrayers }],
    });

    if (!me) {
        return <div>Login to follow</div>;
    }

    // if you are not the owner of the prayer and you are not following the user
    // then you can follow the user
    if (
        me &&
        me?.id !== prayer.user.id &&
        !me?.createdFollows
            .map((f: Following) => f.followingId.id)
            .includes(prayer.user.id)
    ) {
        return (
            <Button
                onClick={async () => {
                    const value = await follow({
                        variables: {
                            id:
                                typeof prayer.user.id === "string"
                                    ? parseFloat(prayer.user.id)
                                    : prayer.user.id,
                        },
                    });
                    if (value) {
                        addToast({
                            type: "success",
                            message: "Followed!",
                        });
                    }
                }}
            >
                Follow
            </Button>
        );
    }

    // if you already follow the user then it will tell you
    if (me?.id !== prayer.user.id) {
        return <div>You already follow this person!</div>;
    }

    // If you are the owner of the prayer
    // You can have the option to delete it or
    // edit it
    return (
        <>
            <Button
                onClick={() => {
                    deletePrayer({
                        variables: {
                            id:
                                typeof prayer.id === "string"
                                    ? parseFloat(prayer.id)
                                    : prayer.id,
                        },
                    });
                }}
            >
                Delete Prayer
            </Button>
            <Link to={`/prayer/edit/${prayer.id}`}>
                <Button>Edit</Button>
            </Link>
        </>
    );
};

export default RenderPrayer;