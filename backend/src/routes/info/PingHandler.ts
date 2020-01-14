import { Request, ResponseToolkit } from '@hapi/hapi';

class PingHandler {
  static async handle(request: Request, h: ResponseToolkit) {
    return h.response({
      message: 'Pong!'
    });
  }
}

export default PingHandler;
