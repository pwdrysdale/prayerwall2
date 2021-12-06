import { FC } from "react";

import { IoClose } from "react-icons/io5";
import { Link } from "react-router-dom";
import { IoAddSharp, IoRemoveSharp } from "react-icons/io5";

import { userInfo } from "../../store/userInfo";
import { Prayer, User } from "../../types";

import styles from "./RenderPrayer.module.css";
import { loader } from "graphql.macro";
import { useMutation } from "@apollo/client";
import { useToasts } from "../../store/useToasts";
const addToListMutation = loader("../PublicPrayers/AddToList.graphql");
const removeFromListMutation = loader(
    "../PublicPrayers/RemoveFromList.graphql"
);

// items to go in the menu

// for anonymous
// login to do things

// for logged in user
// add to list / remove from list

// for owner of prayer
// add to list / remove from list
// edit prayer
// delete prayer

export interface MenuInterface {
    toggleMenu: React.Dispatch<React.SetStateAction<boolean>>;
    user: Partial<User>;
    prayerId: number;
    prayerUser: number;
}

const Menu: FC<MenuInterface> = ({
    toggleMenu,
    user,
    prayerUser,
    prayerId,
}) => {
    return (
        <div className={styles.menu}>
            <div className={styles.header}>
                <h3>Menu</h3>
                <IoClose
                    onClick={() => toggleMenu(false)}
                    className={styles.icon}
                />
            </div>
            <ul>
                {!user || !user.id ? (
                    <LoggedOutItems />
                ) : prayerUser === user.id ? (
                    <IAmThePrayerOwner />
                ) : (
                    <LoggedInUserItems user={user} prayerId={prayerId} />
                )}
            </ul>
        </div>
    );
};

const LoggedOutItems: FC = () => {
    return (
        <li>
            <Link to="/login">Login to interact with this prayer</Link>
        </li>
    );
};

interface LoggedInUserMenuItems {
    user: Partial<User>;
    prayerId: number;
}
const LoggedInUserItems: FC<LoggedInUserMenuItems> = ({ user, prayerId }) => {
    const { addToast } = useToasts();

    const [addToList] = useMutation(addToListMutation, {
        awaitRefetchQueries: true,
        // refetchQueries: [{ query: publicPrayers }],
        errorPolicy: "all",
        onError: () => {
            addToast({
                type: "error",
                message: "Could not add prayer to list. Sorry. ",
            });
        },
        onCompleted: () => {
            addToast({
                type: "success",
                message: "Prayer added to list",
            });
        },
    });

    const [removeFromList] = useMutation(removeFromListMutation, {
        awaitRefetchQueries: true,
        // refetchQueries: [{ query: publicPrayers }],
        errorPolicy: "all",
        onError: () => {
            addToast({
                type: "error",
                message: "Could not remove prayer from list. Sorry. ",
            });
        },
        onCompleted: () => {
            addToast({
                type: "success",
                message: "Prayer removed to list.",
            });
        },
    });

    return (
        <>
            <li>I am an observer of the prayer</li>
            {user.lists?.map((list) => (
                <li key={list.id}>
                    {list.name}
                    {list?.prayers
                        ?.map((prayer: Partial<Prayer>) => prayer.id)
                        .includes(prayerId) ? (
                        <div
                            className={styles.actionStep}
                            onClick={() =>
                                removeFromList({
                                    variables: {
                                        addRemovePrayerToListInputs: {
                                            prayerId:
                                                typeof prayerId === "string"
                                                    ? parseFloat(prayerId)
                                                    : prayerId,
                                            listId:
                                                typeof list.id === "string"
                                                    ? parseFloat(list.id)
                                                    : list.id,
                                        },
                                    },
                                })
                            }
                        >
                            Remove From List
                            <IoRemoveSharp className={styles.actionIcon} />
                        </div>
                    ) : (
                        <div
                            className={styles.actionStep}
                            onClick={() =>
                                addToList({
                                    variables: {
                                        addRemovePrayerToListInputs: {
                                            listId:
                                                typeof list.id === "string"
                                                    ? parseFloat(list.id)
                                                    : list.id,
                                            prayerId:
                                                typeof prayerId === "string"
                                                    ? parseFloat(prayerId)
                                                    : prayerId,
                                        },
                                    },
                                })
                            }
                        >
                            Add to List
                            <IoAddSharp className={styles.actionIcon} />
                        </div>
                    )}
                </li>
            ))}
        </>
    );
};

const IAmThePrayerOwner = () => {
    return (
        <>
            <li>I am the prayer owner</li>
        </>
    );
};

export default Menu;
