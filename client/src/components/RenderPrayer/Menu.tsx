import { FC } from "react";

import { IoClose } from "react-icons/io5";

import styles from "./RenderPrayer.module.css";

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
}

const Menu: FC<MenuInterface> = ({ toggleMenu }) => {
    return (
        <div className={styles.menu}>
            <div className={styles.header}>
                <h3>Menu</h3>
                <IoClose
                    onClick={() => toggleMenu(false)}
                    className={styles.icon}
                />
            </div>
        </div>
    );
};

export default Menu;
