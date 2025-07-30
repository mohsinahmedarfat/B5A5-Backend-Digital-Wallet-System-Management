import { Types } from "mongoose";

export enum Role {
  USER = "USER",
  AGENT = "AGENT",
  ADMIN = "ADMIN",
}

export interface IAuthProvider {
  provider: "google" | "credential";
  providerId: string;
}

export interface IUser {
  _id?: Types.ObjectId;
  name: string;
  email: string; // unique
  password?: string; // hashed
  phone?: string; // optional/unique
  picture?: string;
  address?: string;
  role: Role; // "USER" | "AGENT" | "ADMIN"
  isBlocked?: boolean; // default: false
  auths: IAuthProvider[];
  wallet?: Types.ObjectId; // reference to Wallet
  Transactions?: Types.ObjectId[]; // reference to Transaction
}
