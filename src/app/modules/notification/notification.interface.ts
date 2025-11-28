import { Types } from "mongoose";

export interface INotification {
    _id?: Types.ObjectId;
    user: Types.ObjectId; // reference to User
    message: string;
}