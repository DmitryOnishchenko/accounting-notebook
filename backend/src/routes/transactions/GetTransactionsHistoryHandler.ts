import { Request, ResponseToolkit } from '@hapi/hapi';

import { PaginationArgsInterface } from '../types';
import FakeStorageApi from '../../storage/FakeStorageApi';
import { GetTransactionsHistoryResponse } from './types';
import { ValidationsBuilder } from '../../utils/ValidationsBuilder';

const MAX_PAGE_SIZE = 12;

export default class GetTransactionsHistoryHandler {
  static validate = new ValidationsBuilder()
    .useQuery()
    .withInteger('page', 1, false)
    .withInteger('pageSize', 1, false)
    .build();

  static async handle(request: Request, h: ResponseToolkit) {
    const { page = 1, pageSize = MAX_PAGE_SIZE } = request.query as PaginationArgsInterface;

    // TODO: after some auth logic
    const userId = 1;

    // get history
    const total = await FakeStorageApi.getTotalTransactionsByUserID(userId);
    const transactions = await FakeStorageApi.getTransactionsByUserId(userId, page, Math.min(pageSize, MAX_PAGE_SIZE));

    const response: GetTransactionsHistoryResponse = {
      total,
      transactions
    };
    return h.response(response);
  }
}
