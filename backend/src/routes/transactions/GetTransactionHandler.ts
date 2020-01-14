import { Request, ResponseToolkit } from '@hapi/hapi';

import FakeStorageApi from '../../storage/FakeStorageApi';
import { GetTransactionParams } from './types';
import { ValidationsBuilder } from '../../utils/ValidationsBuilder';
import ErrorCodes from '../ErrorCodes';

export default class GetTransactionHandler {
  static validate = new ValidationsBuilder()
    .useParams()
    .withInteger('id', 1)
    .build();

  static async handle(request: Request, h: ResponseToolkit) {
    const { id } = request.params as unknown as GetTransactionParams;

    // TODO: after some auth logic
    const userId = 1;

    const transaction = await FakeStorageApi.getTransactionById(userId, id);
    if (!transaction) {
      return h.response({
        errorCode: ErrorCodes['TRANSACTION.INVALID_ID'],
        error: 'Invalid transaction id'
      }).code(400);
    }

    return h.response(transaction);
  }
}
