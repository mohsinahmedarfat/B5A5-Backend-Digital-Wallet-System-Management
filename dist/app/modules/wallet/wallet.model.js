"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wallet = void 0;
const mongoose_1 = require("mongoose");
const wallet_interface_1 = require("./wallet.interface");
const walletSchema = new mongoose_1.Schema({
    // The user ID
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, "User ID is required for wallet creation"],
        ref: "User",
    },
    balance: {
        type: Number,
        default: 50,
    },
    status: {
        type: String,
        enum: Object.values(wallet_interface_1.WalletStatus),
        default: wallet_interface_1.WalletStatus.ACTIVE,
    },
}, {
    timestamps: true,
    versionKey: false,
});
exports.Wallet = (0, mongoose_1.model)("Wallet", walletSchema);
