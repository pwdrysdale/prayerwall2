import { FC } from "react";

import { IoClose } from "react-icons/io5";
import { Link } from "react-router-dom";
import {
    IoAddSharp,
    IoRemoveSharp,
    IoTrashSharp,
    IoOptionsSharp,
} from "react-icons/io5";

import { Prayer, User } from "../../types";

import styles from "./RenderPrayer.module.css";
import { loader } from "graphql.macro";
import { useMutation } from "@apollo/client";
import { useToasts } from "../../store/useToasts";
const addToListMutation = loader("../PublicPrayers/AddToList.graphql");
const removeFromListMutation = loader(
    "../PublicPrayers/RemoveFromList.graphql"
);
const deletePrayerMutation = loader("../MyPrayers/deletePrayer.graphql");

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
                    <IAmThePrayerOwner user={user} prayerId={prayerId} />
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
            <h3>List Items</h3>
            {user.lists?.map((list) => (
                <li key={list.id}>
                    <Link to={`/lists/${list.id}`}>{list.name}</Link>
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

const IAmThePrayerOwner: FC<LoggedInUserMenuItems> = ({ user, prayerId }) => {
    const [deletePrayer] = useMutation(deletePrayerMutation, {
        awaitRefetchQueries: true,
        // refetchQueries: [{ query: publicPrayers }],
    });
    return (
        <>
            <LoggedInUserItems user={user} prayerId={prayerId} />
            <h3>Prayer Owner Actions</h3>
            <li>
                <Link to={`/prayer/edit/${prayerId}`}>
                    <div className={styles.actionStep}>
                        Edit Prayer
                        <IoOptionsSharp className={styles.actionIcon} />
                    </div>
                </Link>
            </li>
            <li>
                <div
                    className={styles.actionStep}
                    onClick={() => {
                        deletePrayer({
                            variables: {
                                id:
                                    typeof prayerId === "string"
                                        ? parseFloat(prayerId)
                                        : prayerId,
                            },
                        });
                    }}
                >
                    Delete Prayer
                    <IoTrashSharp className={styles.actionIcon} />
                </div>
            </li>
        </>
    );
};

export default Menu;
