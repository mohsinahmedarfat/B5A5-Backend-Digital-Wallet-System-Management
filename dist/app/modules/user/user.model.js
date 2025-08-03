"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const user_interface_1 = require("./user.interface");
const authProviderSchema = new mongoose_1.Schema({
    provider: { type: String, enum: ["google", "credential"], required: true },
    providerId: { type: String, required: true },
}, {
    timestamps: true,
    versionKey: false,
});
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false }, // select: false => do not return password by default
    phone: { type: String, unique: true, sparse: true }, // sparse: true => allow unique constraint to be ignored if the field is not present
    picture: { type: String },
    address: { type: String },
    role: {
        type: String,
        enum: Object.values(user_interface_1.Role), // "USER", "AGENT", "ADMIN"
        default: user_interface_1.Role.USER,
    },
    approvalStatus: {
        type: String,
        enum: Object.values(user_interface_1.ApprovalStatus), // "PENDING", "APPROVED", "SUSPENDED"
    },
    isBlocked: { type: Boolean, default: false },
    auths: [authProviderSchema], // array of auth providers
    wallet: { type: mongoose_1.Schema.Types.ObjectId, ref: "Wallet" }, // reference to Wallet
    Transactions: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Transaction" }], // reference to Transaction
}, {
    timestamps: true,
    versionKey: false,
});
exports.User = (0, mongoose_1.model)("User", userSchema);
