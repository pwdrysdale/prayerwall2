import create from "zustand";

export interface UserInfo {
    id: number | null;
    username: string | null;
    role: string | null;
    image: string | null;
}

export const userInfo = create<{
    user: UserInfo;
    setUser: (newUser: UserInfo) => void;
    clearUser: () => void;
}>((set) => ({
    user: {
        id: null,
        role: null,
        image: null,
        username: null,
    },
    setUser: (newUser): void =>
        set((state) => ({
            ...state,
            user: newUser,
        })),
    clearUser: (): void =>
        set((state) => ({
            ...state,
            user: {
                id: null,
                role: null,
                image: null,
                username: null,
            },
        })),
}));
