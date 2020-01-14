import config from 'config';
import Hapi, { Server } from '@hapi/hapi';

import { Logger } from '../utils/Logger';
const LOG = Logger.getLogger('Server.ts');

import { GracefulShutdownHelper } from '../utils/GracefulShutdownHelper';

import InfoRoutes from '../routes/info/_InfoRoutes';
import TransactionsRoutes from '../routes/transactions/_TransactionsRoutes';

export async function start() {
  try {
    LOG.info(`Env: ${process.env.NODE_ENV}, server PID: ${process.pid}. Initialization started...`);

    const server = new Hapi.Server({
      port: config.port,
      host: config.host,
      routes: {
        cors: {
          origin: ['*'],
        }
      }
    }) as Server;

    await GracefulShutdownHelper.applyToServer(server, LOG);

    // init routes
    server.route(InfoRoutes);
    server.route(TransactionsRoutes);

    await server.start();
    LOG.info(`Server running at: ${server.info.uri}`);
  } catch (err) {
    LOG.error('Server initialization failed: %s', err.stack);
    process.exit(1);
  }
}
