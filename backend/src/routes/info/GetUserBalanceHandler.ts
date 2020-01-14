import { Request, ResponseToolkit } from '@hapi/hapi';

import FakeStorageApi from '../../storage/FakeStorageApi';
import { GetUserBalanceResponse } from './types';

export default class GetUserBalanceHandler {
  static async handle(request: Request, h: ResponseToolkit) {
    // TODO: after some auth logic
    const userId = 1;

    const currentBalance = await FakeStorageApi.getBalanceByUserId(userId);

    const response: GetUserBalanceResponse = {
      balance: currentBalance.toString(10)
    };
    return h.response(response);
  }
}
