import { User } from ".";

export interface Following {
    id: number;
    userId: User;
    followingId: User;
    createdAt: Date;
    updatedAt: Date;
}
