import React from "react";
import styles from "./frontStyles.module.css";

const FrontScreen = () => {
    return (
        <div
            style={{
                backgroundImage: `url(https://images.unsplash.com/photo-1603612692333-7bac35e43500?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNzg4NTd8MHwxfHNlYXJjaHwxM3x8bmF0dXJlJTIwZ3JlZW58ZW58MHx8fHwxNjM4NDU3NzM0&ixlib=rb-1.2.1&q=80&w=1080)`,
            }}
            className={`card ${styles.frontWelcome}`}
        >
            <div className={styles.twoColumnText}>
                <h1>Welcome to the Prayer Wall</h1>
                <h3>Bring your cares and concerns to the Lord</h3>
            </div>
        </div>
    );
};

export default FrontScreen;
