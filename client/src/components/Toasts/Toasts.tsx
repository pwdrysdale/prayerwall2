import { FormEvent, useState } from "react";
import { useToasts, Toast } from "../../store/useToasts";

const Toasts = () => {
    const [toast, setToast] = useState("");

    const { addToast, removeToast, toasts } = useToasts();

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        addToast({ message: toast, type: "success" });
        setToast("");
    };
    return (
        <div>
            <h1>Toasts</h1>
            {toasts.map((toast: Toast) => (
                <div key={toast.id}>
                    <div>{toast.message}</div>
                    <div
                        onClick={() => {
                            removeToast(toast.id);
                        }}
                    >
                        Remove toast
                    </div>
                </div>
            ))}
            <form onSubmit={onSubmit}>
                <label htmlFor="toast">Add Toast: </label>
                <input
                    type="text"
                    id="toast"
                    value={toast}
                    onChange={(e) => setToast(e.target.value)}
                />
            </form>
        </div>
    );
};

export default Toasts;
