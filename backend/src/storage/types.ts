import BigNumber from 'bignumber.js';

export interface InternalStorageInterface {
  // userId
  balances: {
    [key: number]: BigNumber;
  };
  transactionsMap: {
    // userId
    [key: number]: Transaction[];
  };
}

export enum TransactionType {
  debit = 'debit',
  credit = 'credit'
}

export interface Transaction {
  id: number;
  userId: number;
  type: TransactionType;
  amount: string;
  createdAt: Date;
}
