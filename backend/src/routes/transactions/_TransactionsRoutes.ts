import { ServerRoute } from '@hapi/hapi';

import GetTransactionsHistoryHandler from './GetTransactionsHistoryHandler';

export default [
  {
    method: 'GET',
    path: '/transactions',
    handler: GetTransactionsHistoryHandler.handle,
    options: {
      auth: false,
      validate: GetTransactionsHistoryHandler.validate
    }
  }
] as ServerRoute[];
