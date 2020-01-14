export interface InternalStorageInterface {
  transactionsMap: {
    // userId
    [key: number]: Transaction[];
  };
}

export enum TransactionType {
  DEBIT = 'debit',
  CREDIT = 'credit'
}

export interface Transaction {
  id: number;
  userId: number;
  type: TransactionType;
  amount: string;
  createdAt: Date;
}
