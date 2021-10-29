import { Following } from ".";

export interface User {
    id: number;
    username: string;
    createdFollows: [Following];
    followingMe: [Following];
}
