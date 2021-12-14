import React from "react";
// import styles from "./Footer.module.css";

const Footer = () => {
    return (
        <footer
        // className={styles.footer}
        >
            <h3>The Prayer Wall 2021</h3>
            <div
            // className={styles.columns}
            >
                <div>
                    <p>Public Prayers</p>
                </div>
                <div>
                    <p>Your Prayers</p>
                </div>
                <div>
                    <p>Following</p>
                </div>
                <div>
                    <p>Subscribe or Something</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
