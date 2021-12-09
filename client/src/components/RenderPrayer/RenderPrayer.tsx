import { useState, useEffect, useCallback, FC } from "react";
import { useMutation } from "@apollo/client";
import { loader } from "graphql.macro";
import { Link } from "react-router-dom";
import { Photo, Prayer, PrayerCategory, User } from "../../types";
import styles from "./RenderPrayer.module.css";
import ProfileImage from "../UserCards/ProfileImage";
import { useToasts } from "../../store/useToasts";

import {
    IoChatboxOutline,
    IoArrowUpOutline,
    IoOptionsSharp,
} from "react-icons/io5";
import TypePill, { PrayerType } from "./TypePill";
import Menu from "./Menu";
const TextClamp = require("react-string-clamp");

const followMutation = loader("../PublicPrayers/Follow.graphql");
const publicPrayers = loader("../PublicPrayers/PublicPrayers.graphql");

const prayedMutation = loader("../PublicPrayers/Prayed.graphql");

interface RenderPrayerProps {
    prayer: Prayer;
    me: User;
}

const RenderPrayer: FC<RenderPrayerProps> = ({ prayer, me }) => {
    const [photo, setPhoto] = useState<null | Photo>();
    const [colorClass, setColorClass] = useState<string>("");
    const [expandedText, setExpandedText] = useState<boolean>(false);
    const [showMenu, setShowMenu] = useState<boolean>(false);

    const { addToast } = useToasts();

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
            className={`card ${colorClass} ${styles.card} `}
            style={{
                backgroundImage: photo?.urls?.regular
                    ? `url(${photo?.urls?.regular})`
                    : "none",
            }}
            onMouseEnter={(): void => {
                setExpandedText(true);
            }}
            onMouseLeave={(): void => {
                setExpandedText(false);
            }}
        >
            {prayer.answered && (
                <div className={styles.answeredBox}>Answered</div>
            )}
            <div className={`${styles.cardMain}`}>
                <div className={`${styles.cardTextDetail}  `}>
                    <h1 className={styles.prayerName}>{prayer.title}</h1>

                    <TypePill
                        type={PrayerCategory[prayer.category] as PrayerType}
                    />

                    <input
                        type="checkbox"
                        id="bodyText"
                        checked={expandedText}
                    />
                    <label
                        htmlFor="bodyText"
                        className={`${styles.cardMainLabel} ${
                            expandedText && styles.cardMainLabelChecked
                        }`}
                    >
                        <p>{prayer.body}</p>
                    </label>
                </div>
                <div className={styles.buttonGroup}>
                    {prayer.user && (
                        <ProfileImage
                            src={prayer.user.image}
                            alt={prayer.user.username}
                        />
                    )}
                    <div
                        className={styles.iconGroup}
                        onClick={() => {
                            if (!me?.id) {
                                addToast({
                                    message:
                                        "Login to register to record your prayer",
                                    type: "error",
                                });
                                return;
                            }

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
                        <span>{prayer.comments?.length}</span>
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
            {showMenu && (
                <Menu
                    toggleMenu={setShowMenu}
                    user={me}
                    prayerId={prayer.id}
                    prayerUser={prayer.user.id}
                    isAnswered={prayer.answered}
                    isPrivat={prayer.privat}
                />
            )}
        </div>
    );
};

export default RenderPrayer;
