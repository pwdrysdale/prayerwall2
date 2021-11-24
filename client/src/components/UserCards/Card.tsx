import React from "react";
import { Link } from "react-router-dom";
import ProfileImage from "./ProfileImage";
import styles from "./styles.module.css";

const Body = ({
    img,
    username,
    role,
}: {
    img: string | null;
    username: string;
    role?: string;
}) => {
    return (
        <div className={styles.card}>
            {img && <ProfileImage src={img} alt={username} />}
            <h3>{username}</h3>
            {role && <h3>{role}</h3>}
        </div>
    );
};

const Card = ({
    img,
    username,
    link,
    role,
}: {
    img: string | null;
    username: string;
    link?: string;
    role?: string;
}) => {
    if (link) {
        return (
            <Link to={link}>
                <Body img={img} username={username} role={role} />
            </Link>
        );
    } else return <Body img={img} username={username} role={role} />;
};

export default Card;
