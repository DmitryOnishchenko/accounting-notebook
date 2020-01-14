import { Request, ResponseToolkit } from '@hapi/hapi';
import Joi, { Schema } from 'joi';
import _ from 'lodash';

import { Logger } from './Logger';
const LOG = Logger.getLogger('ValidationsBuilder.ts');

export const bigNumberValidation = new RegExp('(^$)|(^[0-9]{1,18}\\.?[0-9]{0,18}$)');

const failAction = (request: Request, h: ResponseToolkit, error: Error) => {
  const logs = [`path: ${request.path}`];

  const userId = _.get(request, 'auth.credentials.userId', null);
  if (userId) {
    logs.push(`userId: ${userId}`);
  }

  const errorMsg = _.get(error, 'output.payload.message', error.message);
  LOG.error(`${logs.join(', ')} - validation error: ${errorMsg}`);
  return h.response({ error: errorMsg }).code(400).takeover();
};

export class ValidationsBuilder {
  currentObj: { [key: string]: Schema } = {};
  payload: { [key: string]: Schema } = null;
  params: { [key: string]: Schema } = null;
  query: { [key: string]: Schema } = null;

  /**
   * Use methods
   */
  usePayload() {
    this.currentObj = this.payload = {};
    return this;
  }

  useParams() {
    this.currentObj = this.params = {};
    return this;
  }

  useQuery() {
    this.currentObj = this.query = {};
    return this;
  }

  /**
   * Validations
   */
  withBigNumberString(fieldName: string, required = true) {
    let schema = Joi.string().regex(bigNumberValidation).error(() => 'missing value or max 18 decimals');
    if (required) {
      schema = schema.required();
    }

    this.currentObj[fieldName] = schema;
    return this;
  }

  withInteger(fieldName: string, min = 0, required = true) {
    let schema = Joi.number().min(min).max(Number.MAX_SAFE_INTEGER);
    if (required) {
      schema = schema.required();
    }

    this.currentObj[fieldName] = schema;
    return this;
  }

  withCustomValidation(fieldName: string, schema: Schema) {
    this.currentObj[fieldName] = schema;
    return this;
  }

  build() {
    return {
      params: this.params,
      payload: this.payload,
      query: this.query,
      failAction
    };
  }
}
