import { Types } from "mongoose";

export enum WalletStatus {
    ACTIVE = "ACTIVE",
    BLOCKED = "BLOCKED",
}

export interface IWallet {
    _id?: Types.ObjectId;
    user: Types.ObjectId; // reference to User
    balance: number; // default: 50
    status: WalletStatus // default: "ACTIVE"
    // currency: string; // e.g., "USD", "EUR"
}