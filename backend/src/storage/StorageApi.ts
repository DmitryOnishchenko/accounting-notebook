import { InternalStorageInterface, Transaction } from './types';

const internal: InternalStorageInterface = {
  transactionsMap: {}
};

export default class StorageApi {
  static async getTotalTransactionsByUserID(userId: number): Promise<number> {
    return internal.transactionsMap[userId]
      ? internal.transactionsMap[userId].length
      : 0;
  }

  static async getTransactionsByUserId(userId: number, page: number, pageSize: number): Promise<Transaction[]> {
    const transactions = internal.transactionsMap[userId];
    if (!transactions) {
      return [];
    }

    const offset = page - 1;
    const start = offset * pageSize;
    const end = start + pageSize;

    return transactions.slice(start, end);
  }
}
