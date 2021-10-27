import { PrayedBy, PrayerComments, User } from ".";

export enum PrayerCategory {
    "thanks" = "Thanks",
    "sorry" = "Sorry",
    "please" = "Please",
}

export interface Prayer {
    id: number | string;
    title: string;
    body: string;
    privat: boolean;
    answered: boolean;
    category: PrayerCategory;
    user: User;
    comments: [PrayerComments];
    prayedBy: [PrayedBy];
    prayedByUser: number;
    createdDate: Date;
}
