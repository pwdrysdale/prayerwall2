import styles from "./RenderPrayer.module.css";

export type PrayerType = "thanks" | "sorry" | "please";
interface TypePillProps {
    type: PrayerType;
}

const TypePill: React.FC<TypePillProps> = ({ type }) => {
    const getBgColor = (prayerType: PrayerType) => {
        switch (prayerType) {
            case "thanks":
                return "greenBgText";
            case "sorry":
                return "redBgText";
            case "please":
                return "blueBgText";
            default:
                return "";
        }
    };
    return (
        <div className={`${getBgColor(type)}  ${styles.typePill}`}>
            <div className={styles.typePillText}>{type}</div>
        </div>
    );
};

export default TypePill;
