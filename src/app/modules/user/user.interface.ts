import { Types } from "mongoose";

export enum Role {
  USER = "USER",
  AGENT = "AGENT",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
}

export enum ApprovalStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  SUSPENDED = "SUSPENDED",
}

export interface IAuthProvider {
  provider: "google" | "credential";
  providerId: string;
}

export interface IUser {
  _id?: Types.ObjectId;
  name: string;
  email: string; // unique
  password: string; // hashed
  phone?: string; // optional/unique
  picture?: string;
  address?: string;
  role: Role; // "USER" | "AGENT" | "ADMIN"
  approvalStatus?: ApprovalStatus // "PENDING" | "APPROVED" | "SUSPENDED"
  isBlocked: boolean; // default: false
  auths: IAuthProvider[];
  wallet?: Types.ObjectId; // reference to Wallet
  Transactions?: Types.ObjectId[]; // reference to Transaction
}
