import React, { useEffect } from "react";
import { Link } from "react-router-dom";

import { userInfo } from "../../store/userInfo";
import Card from "../UserCards/Card";

import styles from "./navstyles.module.css";

const Navbar = () => {
    const [hidden, setHidden] = React.useState(false);
    const [y, setY] = React.useState(window.scrollY);

    const { user } = userInfo();

    useEffect(() => {
        window.addEventListener("scroll", () => {
            const scroll = window.scrollY;
            if (y > scroll) {
                setHidden(false);
            } else if (scroll > 100) {
                setHidden(true);
            } else {
                setHidden(false);
            }
            setY(scroll);
        });
    }, [y]);

    return (
        <div className={`${styles.navbar} ${hidden && styles.navbar_hide}`}>
            <Link to="/">
                <h1>Prayer Wall 2</h1>
            </Link>
            <div className={styles.right}>
                {user.username && (
                    <Card
                        img={user.image}
                        username={user.username || "Anonymous User"}
                        role={user.role || "Not logged in"}
                    />
                )}
                <ul>
                    {user.id ? (
                        <>
                            <Link to="/prayer/add">
                                <li>Add Prayer</li>
                            </Link>
                            <Link to="/prayer/my">
                                <li>My Prayers</li>
                            </Link>
                            <Link to="/user/following">
                                <li>Following</li>
                            </Link>
                            <Link to="/prayer/following">
                                <li>Following Prayers</li>
                            </Link>
                            <Link to="/lists/my">
                                <li>My Lists</li>
                            </Link>
                            <Link to="/lists/add">
                                <li>Add A List</li>
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/login">
                                <li>Login</li>
                            </Link>
                        </>
                    )}

                    <Link to="/prayer/public">
                        <li>Public Prayers</li>
                    </Link>

                    <Link to="/give">
                        <li>Give</li>
                    </Link>
                </ul>
            </div>
        </div>
    );
};

export default Navbar;
