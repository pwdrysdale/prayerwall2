import { useToasts, Toast } from "../../store/useToasts";
import { IoClose } from "react-icons/io5";

import styles from "./ToastStyle.module.css";

const Toasts = () => {
    const { removeToast, toasts } = useToasts();

    return (
        <div className={styles.wrapper}>
            {toasts.map((toast: Toast) => (
                <div
                    key={toast.id}
                    className={`${styles.box} ${
                        toast.type === "success"
                            ? "greenBgText"
                            : toast.type === "error"
                            ? "redBgText"
                            : "blueBgText"
                    }`}
                >
                    <p>{toast.message}</p>
                    <IoClose
                        className={styles.close}
                        onClick={() => {
                            removeToast(toast.id);
                        }}
                    />
                </div>
            ))}
        </div>
    );
};

export default Toasts;
