import { Prayer, User } from ".";

export interface PrayedBy {
    id: number;
    user: User;
    prayer: Prayer;
    createdAt: Date;
}
