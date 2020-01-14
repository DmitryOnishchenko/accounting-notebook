import { ServerRoute } from '@hapi/hapi';

import GetTransactionsHistoryHandler from './GetTransactionsHistoryHandler';
import AddTransactionHandler from './AddTransactionHandler';
import GetTransactionHandler from './GetTransactionHandler';

export default [
  {
    method: 'GET',
    path: '/transactions',
    handler: GetTransactionsHistoryHandler.handle,
    options: {
      auth: false,
      validate: GetTransactionsHistoryHandler.validate
    }
  },
  {
    method: 'POST',
    path: '/transactions',
    handler: AddTransactionHandler.handle,
    options: {
      auth: false,
      validate: AddTransactionHandler.validate
    }
  },
  {
    method: 'GET',
    path: '/transactions/{id}',
    handler: GetTransactionHandler.handle,
    options: {
      auth: false,
      validate: GetTransactionHandler.validate
    }
  }
] as ServerRoute[];
