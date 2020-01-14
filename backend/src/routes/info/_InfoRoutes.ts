import { ServerRoute } from '@hapi/hapi';

import PingHandler from './PingHandler';

export default [
  {
    method: 'GET',
    path: '/info/healthcheck/ping',
    handler: PingHandler.handle,
    options: {
      auth: false
    }
  }
] as ServerRoute[];
