import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { IoMenuOutline } from "react-icons/io5";

import { userInfo } from "../../store/userInfo";
import ProfileImage from "../UserCards/ProfileImage";

import styles from "./navstyles.module.css";
import { useToasts } from "../../store/useToasts";

const Navbar = () => {
    const [hidden, setHidden] = React.useState(false);
    const [y, setY] = React.useState(window.scrollY);
    const [showMenuItems, setShowMenuItems] = React.useState(false);

    const { user, clearUser } = userInfo();

    const { addToast } = useToasts();

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

    const logout = (): void => {
        clearUser();
        addToast({ message: "Logged out successfully", type: "success" });
        window.open("http://localhost:4000/auth/logout", "_self");
    };

    return (
        <div className={`${styles.navbar} ${hidden && styles.navbar_hide}`}>
            <Link to="/">
                <h1>Prayer Wall 2</h1>
            </Link>
            <div className={styles.right}>
                {user.username && (
                    <ProfileImage
                        src={user.image || "https://i.imgur.com/X2JkUZT.png"}
                        alt={user.username || "Anonymous User"}
                    />
                )}
                <IoMenuOutline
                    className={styles.hamburger}
                    onMouseEnter={() => setShowMenuItems(true)}
                    onMouseLeave={() => setShowMenuItems(false)}
                />
                {showMenuItems && (
                    <ul
                        onMouseLeave={() => setShowMenuItems(false)}
                        onMouseEnter={() => setShowMenuItems(true)}
                    >
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

                                <li onClick={logout}>Log out</li>
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
                )}
            </div>
        </div>
    );
};

export default Navbar;
