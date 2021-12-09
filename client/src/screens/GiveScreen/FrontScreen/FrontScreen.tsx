import { useQuery } from "@apollo/client";
import { loader } from "graphql.macro";
import React, { useEffect } from "react";
import RenderPrayer from "../../../components/RenderPrayer/RenderPrayer";
import { useToasts } from "../../../store/useToasts";
import { Prayer } from "../../../types";
import styles from "./frontStyles.module.css";

const FEATURED_PRAYERS = loader("./FeaturedPrayers.graphql");

const FrontScreen = () => {
    const { addToast } = useToasts();

    const { data } = useQuery(FEATURED_PRAYERS, {
        onError: (error) => {
            addToast({
                message: error.message,
                type: "error",
            });
        },
    });

    return (
        <>
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
            {data && (
                <>
                    <h1>Featured Prayers</h1>
                    <div className="prayerContainer">
                        {data.featuredPrayers.map((P: Prayer, idx: number) => (
                            <RenderPrayer me={data.me} prayer={P} key={idx} />
                        ))}
                    </div>
                </>
            )}
        </>
    );
};

export default FrontScreen;
