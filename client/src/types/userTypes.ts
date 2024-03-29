import { Following, List } from ".";
import { Prayer } from ".";

export interface User {
    id: number;
    username: string;
    image: string;
    createdFollows: [Following];
    followingMe: [Following];
    prayers: [Prayer];
    lists: [List];
}
