import { Prayer, User } from ".";

export interface PrayerComments {
    id: number;
    body: string;
    privat: boolean;
    user: User;
    prayer: Prayer;
    createdDate: Date;
    updateDate: Date;
}
