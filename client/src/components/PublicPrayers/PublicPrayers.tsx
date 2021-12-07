import {
    useRef,
    useCallback,
    MutableRefObject,
    useState,
    useEffect,
    useMemo,
    LegacyRef,
} from "react";
import { useInView } from "react-intersection-observer";

import { loader } from "graphql.macro";
import { Prayer } from "../../types";
import { useQuery } from "@apollo/client";
import Button from "../HTML/Button";
import { useToasts } from "../../store/useToasts";
import RenderPrayer from "../RenderPrayer/RenderPrayer";
import styles from "./publicPrayerStyles.module.css";
import { format } from "date-fns";

const publicPrayers = loader("./PublicPrayers.graphql");

const PublicPrayers = () => {
    const [prayers, setPrayers] = useState<Prayer[]>([]);
    const [fullUser, setFullUser] = useState<any>(null);
    const [lastFetch, setLastFetch] = useState<Prayer[]>([]);

    const { addToast } = useToasts();

    const { ref, inView } = useInView();

    const { loading, error, refetch } = useQuery(publicPrayers, {
        errorPolicy: "all",
        variables: { cursor: "" },
        onCompleted: (data) => {
            setLastFetch([...(data.publicPrayers as Prayer[])]);
            setPrayers([...prayers, ...(data.publicPrayers as Prayer[])]);
            setFullUser(data.me);
        },

        onError: (error) => {
            addToast({ type: "error", message: error.message });
        },
    });

    const getMorePrayers = async () => {
        if (prayers && prayers.length > 0 && lastFetch.length > 0) {
            const cursor: Date =
                prayers.length === 0
                    ? new Date()
                    : prayers[prayers.length - 1].createdDate;
            const { data } = await refetch({
                cursor: format(new Date(cursor), "yyyy-MM-dd HH:mm:ss"),
            });
            setLastFetch(data.publicPrayers);
            setPrayers([...prayers, ...(data.publicPrayers as Prayer[])]);
        }
    };

    useEffect(() => {
        getMorePrayers();
    }, [inView]);

    if (loading) return <div>Loading...</div>;
    if (error) {
        console.error(error);
        return <div>Sorry, there was an error...</div>;
    }

    if (prayers === []) {
        return <div>Returned null data</div>;
    }

    if (prayers.length === 0) {
        return <div>You don't have any prayers yet!</div>;
    }

    return (
        <div>
            <h1>Public Prayers</h1>
            <div className={styles.prayerContainer}>
                {prayers &&
                    prayers.map((P: Prayer, idx: number, self: Prayer[]) => (
                        <div key={idx}>
                            <RenderPrayer prayer={P} me={fullUser} />
                        </div>
                    ))}
            </div>
            <Button
                title="Next"
                onClick={() => {
                    const cursor: Date =
                        prayers[prayers.length - 1].createdDate;
                    refetch({
                        cursor: cursor.toString(),
                    });
                }}
            />
            <div ref={ref}>{`The element is in view ${inView}`}</div>
        </div>
    );
};

export default PublicPrayers;
