"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const mongoose_1 = require("mongoose");
const transaction_interface_1 = require("./transaction.interface");
const transactionSchema = new mongoose_1.Schema({
    type: {
        type: String,
        enum: Object.values(transaction_interface_1.TransactionType),
        required: true,
    },
    initiator: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    recipient: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    amount: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
    },
}, {
    timestamps: true,
    versionKey: false,
});
exports.Transaction = (0, mongoose_1.model)("Transaction", transactionSchema);
