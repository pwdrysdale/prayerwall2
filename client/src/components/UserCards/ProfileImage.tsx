import styles from "./styles.module.css";

const ProfileImage = ({ src, alt }: { src: string; alt: string }) => {
    return <img src={src} alt={alt} className={styles.profile} />;
};

export default ProfileImage;
