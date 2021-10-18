export enum PrayerCategory {
    "thanks" = "Thanks",
    "sorry" = "Sorry",
    "please" = "Please",
}

export interface Prayer {
    title: string;
    body: string;
    privat: boolean;
    answered: boolean;
    category: PrayerCategory;
}
