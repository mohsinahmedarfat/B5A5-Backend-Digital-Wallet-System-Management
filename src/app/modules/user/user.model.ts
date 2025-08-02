import { model, Schema } from "mongoose";
import { ApprovalStatus, IAuthProvider, IUser, Role } from "./user.interface";

const authProviderSchema = new Schema<IAuthProvider>(
  {
    provider: { type: String, enum: ["google", "credential"], required: true },
    providerId: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false }, // select: false => do not return password by default
    phone: { type: String, unique: true, sparse: true }, // sparse: true => allow unique constraint to be ignored if the field is not present
    picture: { type: String },
    address: { type: String },
    role: {
      type: String,
      enum: Object.values(Role), // "USER", "AGENT", "ADMIN"
      default: Role.USER,
    },
    approvalStatus: {
      type: String,
      enum: Object.values(ApprovalStatus), // "PENDING", "APPROVED", "SUSPENDED"
    },
    isBlocked: { type: Boolean, default: false },
    auths: [authProviderSchema], // array of auth providers

    wallet: { type: Schema.Types.ObjectId, ref: "Wallet" }, // reference to Wallet
    Transactions: [{ type: Schema.Types.ObjectId, ref: "Transaction" }], // reference to Transaction
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const User = model<IUser>("User", userSchema);
