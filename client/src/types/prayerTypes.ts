import { List, PrayedBy, PrayerComments, User } from ".";

export enum PrayerCategory {
    "thanks",
    "sorry",
    "please",
}

export interface Prayer {
    id: number;
    title: string;
    body: string;
    privat: boolean;
    answered: boolean;
    category: number;
    user: User;
    comments: [PrayerComments];
    lists: [List];
    prayedBy?: [PrayedBy];
    prayedByUser: number;
    createdDate: Date;
    photo?: string;
}
