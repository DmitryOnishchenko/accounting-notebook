import { Server as HapiServer } from '@hapi/hapi';
import { Logger } from 'log4js';

class GracefulShutdownHelperImpl {
  commands: NodeJS.Signals[] = ['SIGTERM', 'SIGINT'];
  shutdownInProgress: boolean = false;
  server: HapiServer;

  /** For HapiJS server */
  applyToServer(server: HapiServer, LOG: Logger) {
    if (!server) {
      throw new Error('Invalid arguments');
    }

    this.server = server;
    this._addSimpleListeners(LOG);
  }

  _addSimpleListeners(LOG: Logger) {
    this.commands.forEach((command: NodeJS.Signals) => {
      process.on(command, async () => {
        LOG.info(`Worker ${process.pid}: '${command}' received`);

        if (this.shutdownInProgress) {
          return;
        }
        this.shutdownInProgress = true;

        LOG.info(`Worker ${process.pid}: stopping Hapi Server...`);

        await this.server.stop();

        LOG.info(`Worker ${process.pid}: done`);
        process.exit();
      });
    });
  }
}

export const GracefulShutdownHelper = new GracefulShutdownHelperImpl();
