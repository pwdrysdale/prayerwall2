import { Following } from ".";

export interface User {
    id: number;
    username: string;
    image: string;
    createdFollows: [Following];
    followingMe: [Following];
}
