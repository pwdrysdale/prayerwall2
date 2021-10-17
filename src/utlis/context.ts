import { Request, Response } from "express";
import { User } from "../entity/User";

export interface MyRequest extends Request {
    user: User;
}

export interface AppContext {
    req: MyRequest;
    res: Response;
}
