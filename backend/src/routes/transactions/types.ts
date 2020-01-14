import { Transaction, TransactionType } from '../../storage/types';

export interface GetTransactionsHistoryResponse {
  total: number;
  transactions: Transaction[];
}

export interface AddTransactionPayload {
  type: TransactionType;
  amount: string;
}

export interface AddTransactionResponse {
  transactionId: number;
  balance: string;
}
