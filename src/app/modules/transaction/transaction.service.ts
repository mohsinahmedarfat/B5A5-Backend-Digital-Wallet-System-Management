import { Transaction } from "./transaction.model";

const getTransactions = async () => {
  // populate the user field with user details
  const transactions = await Transaction.find().populate(
    "initiator recipient",
    "name email role isBlocked"
  );

  return transactions;
};

const getTransactionMe = async (userId: string) => {
  const transaction = await Transaction.find({ 
    $or: [{initiator: userId}, {recipient: userId}]
   }).populate(
    "initiator recipient",
    "email role"
  );
  return {
    data: transaction,
  };
};


export const TransactionServices = {
    getTransactions,
    getTransactionMe
};