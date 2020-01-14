import { ServerRoute } from '@hapi/hapi';

import PingHandler from './PingHandler';
import GetUserBalanceHandler from './GetUserBalanceHandler';

export default [
  {
    method: 'GET',
    path: '/info/healthcheck/ping',
    handler: PingHandler.handle,
    options: {
      auth: false
    }
  },
  {
    method: 'GET',
    path: '/balance',
    handler: GetUserBalanceHandler.handle,
    options: {
      auth: false
    }
  }
] as ServerRoute[];
