import { Types } from "mongoose";

export enum TransactionType {
  TOP_UP = "TOP_UP",
  WITHDRAW = "WITHDRAW",
  SEND = "SEND",
  CASH_IN = "CASH_IN",
  CASH_OUT = "CASH_OUT",
}

export interface ITransaction {
  type: TransactionType;
  initiator: Types.ObjectId; // ObjectId as string
  recipient?: Types.ObjectId; // ObjectId as string, optional for send/cash-in
  amount: number;
  description?: string; // optional
}
