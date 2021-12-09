import { FC } from "react";

import { IoClose } from "react-icons/io5";
import { Link } from "react-router-dom";
import {
    IoAddSharp,
    IoRemoveSharp,
    IoTrashSharp,
    IoOptionsSharp,
    IoCheckmarkDoneOutline,
    IoHammerSharp,
    IoLockOpenSharp,
    IoLockClosedSharp,
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
const MARK_AS_ANSWERED_MUTATION = loader("./MarkAsAnswered.graphql");
const PUBLIC_PRAYERS = loader("../PublicPrayers/PublicPrayers.graphql");
const MY_PRAYERS = loader("../MyPrayers/MyPrayers.graphql");
const MY_LISTS = loader("../MyLists/MyLists.graphql");

// items to go in the menu

// for anonymous
// login to do things

// for logged in user
// add to list / remove from list

// for owner of prayer
// add to list / remove from list
// edit prayer
// delete prayer
// mark as answered
// mark as private

export interface MenuInterface {
    toggleMenu: React.Dispatch<React.SetStateAction<boolean>>;
    user: Partial<User>;
    prayerId: number;
    prayerUser: number;
    isAnswered: boolean;
    isPrivat: boolean;
}

interface LoggedInUserMenuItems {
    user: Partial<User>;
    prayerId: number;
}

interface OwnerMenuInterface extends LoggedInUserMenuItems {
    isAnswered: boolean;
    isPrivat: boolean;
}

const Menu: FC<MenuInterface> = ({
    toggleMenu,
    user,
    prayerUser,
    prayerId,
    isAnswered,
    isPrivat,
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
                    <IAmThePrayerOwner
                        user={user}
                        prayerId={prayerId}
                        isAnswered={isAnswered}
                        isPrivat={isPrivat}
                    />
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

const LoggedInUserItems: FC<LoggedInUserMenuItems> = ({ user, prayerId }) => {
    const { addToast } = useToasts();

    const [addToList] = useMutation(addToListMutation, {
        awaitRefetchQueries: true,
        refetchQueries: [
            { query: PUBLIC_PRAYERS },
            { query: MY_PRAYERS },
            { query: MY_LISTS },
        ],
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
        refetchQueries: [
            { query: PUBLIC_PRAYERS },
            { query: MY_PRAYERS },
            { query: MY_LISTS },
        ],
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
            {user.lists && user.lists.length < 1 && (
                <li>
                    <Link to="/lists/add">
                        Create a list to add this prayer to
                    </Link>
                </li>
            )}
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

const IAmThePrayerOwner: FC<OwnerMenuInterface> = ({
    user,
    prayerId,
    isAnswered,
    isPrivat,
}) => {
    const { addToast } = useToasts();

    const [deletePrayer] = useMutation(deletePrayerMutation, {
        awaitRefetchQueries: true,
        refetchQueries: [
            { query: PUBLIC_PRAYERS },
            { query: MY_PRAYERS },
            { query: MY_LISTS },
        ],
    });

    const [markAsAnswered] = useMutation(MARK_AS_ANSWERED_MUTATION, {
        awaitRefetchQueries: true,
        refetchQueries: [
            { query: PUBLIC_PRAYERS },
            { query: MY_PRAYERS },
            { query: MY_LISTS },
        ],
        errorPolicy: "all",
        onCompleted: (data) => {
            if (data.markAsAnswered) {
                addToast({
                    type: "success",
                    message: "Prayer marked as answered.",
                });
            } else {
                addToast({
                    type: "error",
                    message: "Could not mark prayer as answered. Sorry.",
                });
            }
        },
    });

    return (
        <>
            <LoggedInUserItems user={user} prayerId={prayerId} />
            <h3>Prayer Owner Actions</h3>
            <li>
                <Link to={`/prayer/edit/${prayerId}`}>
                    <div className={`clickable ${styles.actionStep}`}>
                        Edit Prayer
                        <IoOptionsSharp className={styles.actionIcon} />
                    </div>
                </Link>
            </li>
            <li>
                <div
                    className={`clickable ${styles.actionStep}`}
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
            <li
                className={`${styles.actionStep} ${
                    !isAnswered ? "clickable" : ""
                }`}
                onClick={() => {
                    if (!isAnswered) {
                        markAsAnswered({
                            variables: {
                                id:
                                    typeof prayerId === "string"
                                        ? parseFloat(prayerId)
                                        : prayerId,
                            },
                        });
                    }
                }}
            >
                {isAnswered ? (
                    <div className={`clickable ${styles.actionStep}`}>
                        <span>Answered</span>
                        <IoCheckmarkDoneOutline className={styles.actionIcon} />
                    </div>
                ) : (
                    <div className={`clickable ${styles.actionStep}`}>
                        <span>Mark As Answered</span>
                        <IoHammerSharp className={styles.actionIcon} />
                    </div>
                )}
            </li>
            <li>
                {isPrivat ? (
                    <div className={`clickable ${styles.actionStep}`}>
                        <span>Private</span>
                        <IoLockClosedSharp className={styles.actionIcon} />
                    </div>
                ) : (
                    <div className={`clickable ${styles.actionStep}`}>
                        <span>Public</span>
                        <IoLockOpenSharp className={styles.actionIcon} />
                    </div>
                )}
            </li>
        </>
    );
};

export default Menu;
