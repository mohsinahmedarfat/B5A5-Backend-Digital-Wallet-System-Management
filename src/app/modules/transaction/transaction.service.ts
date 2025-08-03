import { Transaction } from "./transaction.model";

const getTransactions = async () => {
  // populate the user field with user details
  const transactions = await Transaction.find().populate(
    "initiator recipient",
    "name email role isBlocked"
  );

  return transactions;
};
export const TransactionServices = {
    getTransactions
};