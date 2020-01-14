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
  withNonce(fieldName = 'nonce') {
    this.currentObj[fieldName] = Joi.alternatives().try([
      Joi.string().required().min(1).max(14),
      Joi.number().required().min(1).max(Number.MAX_SAFE_INTEGER)
    ]);
    return this;
  }

  withBigNumberString(fieldName: string, required = true) {
    let schema = Joi.string().regex(bigNumberValidation).error(() => 'missing value or max 18 decimals');
    if (required) {
      schema = schema.required();
    }

    this.currentObj[fieldName] = schema;
    return this;
  }

  withPrice(fieldName = 'price') {
    this.currentObj[fieldName] = Joi.string().required().regex(bigNumberValidation).error(() => 'missing value or max 18 decimals');
    return this;
  }

  withAmount(fieldName = 'amount') {
    this.currentObj[fieldName] = Joi.string().required().regex(bigNumberValidation).error(() => 'missing value or max 18 decimals');
    return this;
  }

  withSignature(fieldName: string) {
    this.currentObj[fieldName] = Joi.object().required().keys({
      v: Joi.number().integer().only(27, 28).required(),
      r: Joi.string().required().length(66),
      s: Joi.string().required().length(66)
    });
    return this;
  }

  withEthAddress(fieldName: string, required = true) {
    let schema = Joi.string().length(42);
    if (required) {
      schema = schema.required();
    }

    this.currentObj[fieldName] = schema;
    return this;
  }

  withMarket(fieldName = 'market', required = true) {
    let schema = Joi.string().min(5).max(20);
    if (required) {
      schema = schema.required();
    }

    this.currentObj[fieldName] = schema;
    return this;
  }

  withEmail(fieldName = 'email') {
    this.currentObj[fieldName] = Joi.string().min(5).max(100).email().required();
    return this;
  }

  withPasswordHash(fieldName = 'passwordHash') {
    this.currentObj[fieldName] = Joi.string().length(64).required();
    return this;
  }

  withPhone(fieldName = 'phone') {
    this.currentObj[fieldName] = Joi.string().empty('').max(50);
    return this;
  }

  withAssetSymbol(fieldName = 'assetSymbol', required = true) {
    let schema = Joi.string().min(2).max(20);
    if (required) {
      schema = schema.required();
    } else {
      schema = schema.allow(null, '');
    }

    this.currentObj[fieldName] = schema;
    return this;
  }

  withAccessCode(fieldName = 'accessCode', required = true) {
    let schema = Joi.string().min(1).max(32);
    if (required) {
      schema = schema.required();
    } else {
      schema = schema.allow(null, '');
    }

    this.currentObj[fieldName] = schema;
    return this;
  }

  withWithdrawCode(fieldName = 'withdrawCode') {
    this.currentObj[fieldName] = Joi.string().required().min(1).max(50);
    return this;
  }

  withBankInfoId(fieldName = 'bankInfoId') {
    this.currentObj[fieldName] = Joi.number().min(-1).max(Number.MAX_SAFE_INTEGER);
    return this;
  }

  withCode(fieldName: string, length = 8, required = true) {
    if (!fieldName) {
      throw new Error('Invalid args: \'fieldName\'');
    }

    let schema = Joi.string().uppercase().length(length);
    if (required) {
      schema = schema.required();
    }

    this.currentObj[fieldName] = schema;
    return this;
  }

  withSfCode(fieldName = 'code', required = true) {
    let schema = Joi.string().length(5);
    if (required) {
      schema = schema.required();
    }

    this.currentObj[fieldName] = schema;
    return this;
  }

  withUuid(fieldName = 'code', required = true) {
    let schema = Joi.string().length(36);
    if (required) {
      schema = schema.required();
    }

    this.currentObj[fieldName] = schema;
    return this;
  }

  withContainer(fieldName = 'container', required = true) {
    let schema = Joi.object().keys({
      public_key: Joi.string().required().max(66),
      data: Joi.string().required().max(96),
      salt: Joi.string().required().max(36),
      iv: Joi.string().required().max(36)
    });
    if (required) {
      schema = schema.required();
    }

    this.currentObj[fieldName] = schema;
    return this;
  }

  withObject(fieldName: string, required = true) {
    if (!fieldName) {
      throw new Error('Invalid args: \'fieldName\'');
    }

    let schema = Joi.object();
    if (required) {
      schema = schema.required();
    }

    this.currentObj[fieldName] = schema;
    return this;
  }

  withClientId(fieldName = 'clientId', required = true) {
    let schema = Joi.string().max(200);
    if (required) {
      schema = schema.required();
    }

    this.currentObj[fieldName] = schema;
    return this;
  }

  withRole(fieldName = 'role', required = true) {
    let schema = Joi.string().allow('').max(50);
    if (required) {
      schema = schema.required();
    }

    this.currentObj[fieldName] = schema;
    return this;
  }

  withIsoDate(fieldName = 'date', required = true) {
    let schema = Joi.string().isoDate().options({ convert: false });
    if (required) {
      schema = schema.required();
    }

    this.currentObj[fieldName] = schema;
    return this;
  }

  withHash(fieldName = 'hash', required = true) {
    let schema = Joi.string().length(66);
    if (required) {
      schema = schema.required();
    }

    this.currentObj[fieldName] = schema;
    return this;
  }

  withNumber(fieldName: string, required = true) {
    let schema = Joi.number().min(Number.MIN_SAFE_INTEGER).max(Number.MAX_SAFE_INTEGER);
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

  withString(fieldName: string, min = 1, max = 255, required = true, allowEmpty = false) {
    let schema = Joi.string().min(min).max(max);
    if (required) {
      schema = schema.required();
    }

    if (allowEmpty) {
      schema = schema.allow('');
    }

    this.currentObj[fieldName] = schema;
    return this;
  }

  withBoolean(fieldName: string, required = true) {
    if (!fieldName) {
      throw new Error('Invalid args: \'fieldName\'');
    }

    let schema = Joi.boolean();
    if (required) {
      schema = schema.required();
    }

    this.currentObj[fieldName] = schema;
    return this;
  }

  withTrueBoolean(fieldName: string) {
    if (!fieldName) {
      throw new Error('Invalid args: \'fieldName\'');
    }

    this.currentObj[fieldName] = Joi.boolean().valid(true).required();
    return this;
  }

  withTranslationsMap(fieldName: string) {
    this.currentObj[fieldName] = Joi.object().required().pattern(
      /\w+/,
      Joi.string().max(100)
    );
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
