import { Transaction } from '../../storage/types';

export interface GetTransactionsHistoryResponse {
  total: number;
  transactions: Transaction[];
}
