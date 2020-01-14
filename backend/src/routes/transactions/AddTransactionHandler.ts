import { Request, ResponseToolkit } from '@hapi/hapi';
import Joi from 'joi';

import FakeStorageApi from '../../storage/FakeStorageApi';
import { AddTransactionPayload, AddTransactionResponse } from './types';
import { ValidationsBuilder } from '../../utils/ValidationsBuilder';
import { TransactionType } from '../../storage/types';
import { Logger } from '../../utils/Logger';
import { RedisClient } from '../../utils/RedisClient';
import ErrorCodes from '../ErrorCodes';

const LOG = Logger.getLogger('AddTransactionHandler.ts');

export default class AddTransactionHandler {
  static validate = new ValidationsBuilder()
    .usePayload()
    .withCustomValidation('type', Joi.string().required().valid(Object.keys(TransactionType)))
    .withBigNumberString('amount')
    .build();

  static async handle(request: Request, h: ResponseToolkit) {
    const { type, amount } = request.payload as AddTransactionPayload;

    // TODO: after some auth logic
    const userId = 1;

    return await RedisClient.lock(`Redlock:userId=${userId}:operation=add_transaction`, async () => {
      LOG.info(`UserId: ${userId}. Try to create new ${type} transaction, amount: ${amount}`);

      const currentBalance = await FakeStorageApi.getBalanceByUserId(userId);
      const newBalance = type === TransactionType.credit
        ? currentBalance.minus(amount)
        : currentBalance.plus(amount);

      // check balance if type is credit
      if (type === TransactionType.credit) {
        if (newBalance.lt(0)) {
          LOG.error(
            `UserId: ${userId}. Failed to add new ${type} transaction - `
            + `not enough balance. Amount: ${amount}, current balance: ${currentBalance}`
          );

          return h.response({
            errorCode: ErrorCodes['ADD_TRANSACTION.NOT_ENOUGH_BALANCE'],
            error: `Not enough balance. Current balance: ${currentBalance}`
          }).code(400);
        }
      }

      const transaction = await FakeStorageApi.createTransaction(userId, type, amount);
      await FakeStorageApi.setBalanceByUserId(userId, newBalance);

      LOG.info(
        `UserId: ${userId}. Created new ${type} transaction - `
        + `id: ${transaction.id}, amount: ${transaction.amount}, new balance: ${newBalance.toString(10)}`
      );

      const response: AddTransactionResponse = {
        transactionId: transaction.id,
        balance: newBalance.toString(10)
      };
      return h.response(response);
    });
  }
}
