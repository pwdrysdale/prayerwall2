import { User } from ".";

export enum PrayerCategory {
    "thanks" = "Thanks",
    "sorry" = "Sorry",
    "please" = "Please",
}

export interface Prayer {
    id: number;
    title: string;
    body: string;
    privat: boolean;
    answered: boolean;
    user: User;
    category: PrayerCategory;
    createdDate: Date;
}
