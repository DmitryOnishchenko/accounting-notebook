import config from 'config';
import BluebirdPromise from 'bluebird';
import redis, { RedisClient as RedisClientInterface } from 'redis';
import Redlock from 'redlock';

import { Logger } from './Logger';
const LOG = Logger.getLogger('RedisClient.ts');

BluebirdPromise.promisifyAll(redis.RedisClient.prototype);
BluebirdPromise.promisifyAll(redis.Multi.prototype);

const REDLOCK_TIMEOUT_IN_SEC = 30;
const TREE_SECONDS_IN_MILLIS = 3 * 1000;
const ONE_HOUR_IN_MILLIS = 60 * 60 * 1000;

class RedisClientImpl {
  private redlock: Redlock;

  async lock<T>(resource: string, callback: () => Promise<T>): Promise<T> {
    await this.getRedlock();
    return BluebirdPromise.using(this.redlock.disposer(resource, REDLOCK_TIMEOUT_IN_SEC * 1000), () => callback());
  }

  async getRedlock() {
    if (!this.redlock) {
      const client = await this._getClient('REDLOCK');
      this.redlock = new Redlock(
        // you should have one client for each independent redis node
        // or cluster
        [client],
        {
          // the expected clock drift; for more details
          // see http://redis.io/topics/distlock
          driftFactor: 0.01, // time in ms

          // the max number of times Redlock will attempt
          // to lock a resource before erroring
          retryCount: -1,

          // the time in ms between attempts
          retryDelay: 200, // time in ms

          // the max time in ms randomly added to retries
          // to improve performance under high contention
          // see https://www.awsarchitectureblog.com/2015/03/backoff.html
          retryJitter: 200 // time in ms
        }
      );
    }

    return this.redlock;
  }

  async _getClient(type: string, returnImmediately = false): Promise<RedisClientInterface> {
    return new BluebirdPromise((resolve, reject) => {
      const redisClient = redis.createClient({
        host: config.redis.host,
        port: config.redis.port,
        retry_strategy: function retryStrategy(options) {
          /**
           * - `return;` or `return undefined;` - will end reconnecting with built in error
           * - `return <number>` - retry connection after <number> milliseconds
           * - `return new Error('<text>')` - will end reconnecting with custom error
           *
           * Current implementation - retry every 3 seconds ; max retry time - 1 hour
           */
          if (options.total_retry_time > ONE_HOUR_IN_MILLIS) {
            return new Error('Redis Max retry time exhausted (1 hour)');
          }
          return Math.min(options.attempt * 100, TREE_SECONDS_IN_MILLIS);
        }
      });

      const name = `${process.env.name} (${type})`;
      redisClient.on('error', (err) => {
        const msg = `RedisClient '${name}' error: ${err.message}`;
        LOG.error(msg);
        reject(err);
      });

      redisClient.on('ready', () => {
        resolve(redisClient as RedisClientInterface);
      });

      if (returnImmediately) {
        resolve(redisClient);
      }
    })
      .timeout(2000)
      .then((client: RedisClientInterface) => client)
      .catch((err) => {
        LOG.error('Can\'t connect to Redis - timeout');
        throw err;
      });
  }
}

export const RedisClient = new RedisClientImpl();
