import { InternalStorageInterface, Transaction, TransactionType } from './types';
import BigNumber from 'bignumber.js';

const internal: InternalStorageInterface = {
  balances: {},
  transactionsMap: {}
};
let TX_ID = 1000;

export default class FakeStorageApi {
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

  static async getTransactionById(userId: number, id: number): Promise<Transaction> {
    const transactions = internal.transactionsMap[userId];
    if (!transactions) {
      return null;
    }

    return internal.transactionsMap[userId].find((tx) => tx.id === id);
  }

  static async getBalanceByUserId(userId: number): Promise<BigNumber> {
    return internal.balances[userId] || new BigNumber(0);
  }

  static async createTransaction(userId: number, type: TransactionType, amount: string): Promise<Transaction> {
    const newTransaction: Transaction = {
      id: TX_ID++,
      userId,
      type,
      amount: new BigNumber(amount).toString(10),
      createdAt: new Date()
    };

    if (internal.transactionsMap[userId]) {
      internal.transactionsMap[userId].push(newTransaction);
    } else  {
      internal.transactionsMap[userId] = [newTransaction];
    }

    return newTransaction;
  }
}

// TODO: example seed
internal.balances[1] = new BigNumber(150);
internal.transactionsMap[1] = [
  {
    id: 123,
    userId: 1,
    type: TransactionType.debit,
    amount: '100',
    createdAt: new Date('2020-01-01 12:00:00')
  },
  {
    id: 124,
    userId: 1,
    type: TransactionType.debit,
    amount: '350',
    createdAt: new Date('2020-01-02 17:30:00')
  },
  {
    id: 125,
    userId: 1,
    type: TransactionType.credit,
    amount: '250',
    createdAt: new Date('2020-01-03 11:00:00')
  },
  {
    id: 126,
    userId: 1,
    type: TransactionType.credit,
    amount: '50',
    createdAt: new Date('2020-01-03 22:00:00')
  }
];
internal.transactionsMap[999] = [
  {
    id: 1,
    userId: 999,
    type: TransactionType.debit,
    amount: '125000000',
    createdAt: new Date('2015-01-01 01:00:00')
  }
];
