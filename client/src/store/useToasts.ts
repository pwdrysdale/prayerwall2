import { v4 as uuid } from "uuid";
import create from "zustand";

export interface ToastInput {
    message: string;
    type: "success" | "error" | "info";
}

export interface Toast extends ToastInput {
    id: string;
}

export const useToasts = create<{
    toasts: Toast[];
    addToast: (input: ToastInput) => void;
    removeToast: (id: string) => void;
}>((set) => ({
    toasts: [],
    addToast: (input: ToastInput) => {
        const id = uuid();
        set((state) => {
            setTimeout(() => {
                state.removeToast(id);
            }, 5000);
            return {
                toasts: [...state.toasts, { ...input, id }],
            };
        });
    },
    removeToast: (id: string) =>
        set((state) => ({
            toasts: state.toasts.filter((toast) => toast.id !== id),
        })),
}));
