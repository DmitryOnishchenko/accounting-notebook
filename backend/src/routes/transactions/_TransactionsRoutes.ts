import { ServerRoute } from '@hapi/hapi';

import GetTransactionsHistoryHandler from './GetTransactionsHistoryHandler';
import AddTransactionHandler from './AddTransactionHandler';

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
  }

] as ServerRoute[];
