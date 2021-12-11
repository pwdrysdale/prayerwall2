import { Prayer, User } from ".";

export interface List {
    id: number;
    name: string;
    description: string;
    length: number;
    privat: boolean;
    createdDate: Date;
    updateDate: Date;
    owner: User;
    photo?: string;
    prayers: [Prayer];
}
