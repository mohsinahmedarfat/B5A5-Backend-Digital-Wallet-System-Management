import { model, Schema } from "mongoose";
import { ITransaction, TransactionType } from "./transaction.interface";

const transactionSchema = new Schema<ITransaction>(
  {
    type: {
      type: String,
      enum: Object.values(TransactionType),
      required: true,
    },
    initiator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    amount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Transaction = model<ITransaction>(
  "Transaction",
  transactionSchema
);
