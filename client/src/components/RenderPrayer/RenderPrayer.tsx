import { useState, useEffect, useCallback } from "react";
import { useMutation } from "@apollo/client";
import { loader } from "graphql.macro";
import moment from "moment";
import React from "react";
import { Link } from "react-router-dom";
import { useToasts } from "../../store/useToasts";
import { Photo, Prayer, PrayerCategory, User } from "../../types";
import styles from "./RenderPrayer.module.css";
import ProfileImage from "../UserCards/ProfileImage";

import {
    IoChatboxOutline,
    IoArrowUpOutline,
    IoOptionsSharp,
} from "react-icons/io5";
import TypePill, { PrayerType } from "./TypePill";
import Menu from "./Menu";

const followMutation = loader("../PublicPrayers/Follow.graphql");
const publicPrayers = loader("../PublicPrayers/PublicPrayers.graphql");
const deletePrayerMutation = loader("../MyPrayers/deletePrayer.graphql");
const prayedMutation = loader("../PublicPrayers/Prayed.graphql");
const addToListMutation = loader("../PublicPrayers/AddToList.graphql");

const RenderPrayer = ({ prayer, me }: { prayer: Prayer; me: User }) => {
    const owner = me?.id === prayer.user.id;

    const [photo, setPhoto] = useState<null | Photo>();
    const [colorClass, setColorClass] = useState<string>("");
    const [showMenu, setShowMenu] = useState<boolean>(false);

    useEffect(() => {
        if (prayer.photo) {
            setPhoto(JSON.parse(prayer.photo));
        }
    }, [prayer.photo]);

    const [prayed] = useMutation(prayedMutation, {
        awaitRefetchQueries: true,
        refetchQueries: [{ query: publicPrayers }],
    });

    const bgClass = useCallback(() => {
        const classes = [
            "bgPinkRed",
            "bgCrimson",
            "bgPeach",
            "bgBeige",
            "bgNavy",
        ];

        setColorClass(classes[Math.floor(Math.random() * classes.length)]);
    }, []);
    useEffect((): void => {
        bgClass();
    }, [bgClass]);

    return (
        <div
            className={`card ${colorClass} ${styles.card}`}
            style={{
                backgroundImage: photo?.urls?.regular
                    ? `url(${photo?.urls?.regular})`
                    : "none",
            }}
        >
            <div className={styles.cardMain}>
                <div className={styles.cardTextDetail}>
                    <h1 className={styles.prayerName}>{prayer.title}</h1>

                    <TypePill
                        type={PrayerCategory[prayer.category] as PrayerType}
                    />
                    {/* {owner ? "Owner" : "Not owner"}
                    {prayer.answered ? "Answered!" : "Not answered"} */}
                    <p>{prayer.body}</p>
                </div>
                <div className={styles.buttonGroup}>
                    <ProfileImage
                        src={prayer.user.image}
                        alt={prayer.user.username}
                    />
                    <div
                        className={styles.iconGroup}
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
                        <span>{prayer.prayedByUser}</span>
                        <IoArrowUpOutline className={styles.iconButton} />
                    </div>
                    <div className={styles.iconGroup}>
                        <span>{prayer.comments.length}</span>
                        <Link to={`/prayer/addcomment/${prayer.id}`}>
                            <IoChatboxOutline className={styles.iconButton} />
                        </Link>
                    </div>
                    <div
                        className={styles.iconGroup}
                        onClick={() => setShowMenu(!showMenu)}
                    >
                        <IoOptionsSharp className={styles.iconButton} />
                    </div>
                    {/* <FollowButton prayer={prayer} me={me} />
                    <Lists prayerId={prayer.id} me={me} /> */}
                </div>
            </div>
            {showMenu && <Menu toggleMenu={setShowMenu} />}
        </div>
    );
};

// const FollowButton = ({ me, prayer }: { me: User; prayer: Prayer }) => {
//     const { addToast } = useToasts();

//     const [follow] = useMutation(followMutation, {
//         awaitRefetchQueries: true,
//         refetchQueries: [{ query: publicPrayers }],
//     });

//     const [deletePrayer] = useMutation(deletePrayerMutation, {
//         awaitRefetchQueries: true,
//         refetchQueries: [{ query: publicPrayers }],
//     });

//     if (!me) {
//         return (
//             <div>
//                 <Link to="/login">Login to follow</Link>
//             </div>
//         );
//     }

//     // if you are not the owner of the prayer and you are not following the user
//     // then you can follow the user
//     if (
//         me &&
//         me?.id !== prayer.user.id &&
//         !me?.createdFollows
//             .map((f: Following) => f.followingId.id)
//             .includes(prayer.user.id)
//     ) {
//         return (
//             <Button
//                 onClick={async () => {
//                     const value = await follow({
//                         variables: {
//                             id:
//                                 typeof prayer.user.id === "string"
//                                     ? parseFloat(prayer.user.id)
//                                     : prayer.user.id,
//                         },
//                     });
//                     if (value) {
//                         addToast({
//                             type: "success",
//                             message: "Followed!",
//                         });
//                     }
//                 }}
//             >
//                 Follow
//             </Button>
//         );
//     }

//     // if you already follow the user then it will tell you
//     if (me?.id !== prayer.user.id) {
//         return <div>You already follow this person!</div>;
//     }

//     // If you are the owner of the prayer
//     // You can have the option to delete it or
//     // edit it
//     return (
//         <>
//             <Button
//                 onClick={() => {
//                     deletePrayer({
//                         variables: {
//                             id:
//                                 typeof prayer.id === "string"
//                                     ? parseFloat(prayer.id)
//                                     : prayer.id,
//                         },
//                     });
//                 }}
//             >
//                 Delete Prayer
//             </Button>
//             <Link to={`/prayer/edit/${prayer.id}`}>
//                 <Button>Edit</Button>
//             </Link>
//         </>
//     );
// };

// const Lists = ({ me, prayerId }: { me: User; prayerId: number }) => {
//     const { addToast } = useToasts();

//     const [addToList] = useMutation(addToListMutation, {
//         awaitRefetchQueries: true,
//         refetchQueries: [{ query: publicPrayers }],
//         errorPolicy: "all",
//         onError: () => {
//             addToast({
//                 type: "error",
//                 message: "Could not add prayer to list. Sorry. ",
//             });
//         },
//     });

//     if (!me) {
//         return <div>Login to add to list</div>;
//     }

//     return (
//         <>
//             {!me.lists ? (
//                 <div>Create a list so you can add prayers to it!</div>
//             ) : (
//                 me.lists.map((l: List) => (
//                     <div key={l.id}>
//                         <div>{l.name}</div>
//                         <Button
//                             title="Add to List"
//                             onClick={() =>
//                                 addToList({
//                                     variables: {
//                                         addPrayerToListInputs: {
//                                             listId:
//                                                 typeof l.id === "string"
//                                                     ? parseFloat(l.id)
//                                                     : l.id,
//                                             prayerId:
//                                                 typeof prayerId === "string"
//                                                     ? parseFloat(prayerId)
//                                                     : prayerId,
//                                         },
//                                     },
//                                 })
//                             }
//                         ></Button>
//                     </div>
//                 ))
//             )}
//         </>
//     );
// };

export default RenderPrayer;
