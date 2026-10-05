import Fastify, {
    FastifyError,
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifyServerOptions,
} from 'fastify';
import { corsMiddleware } from './middlewares/cors.middleware.js';
import fastifyHelmet from '@fastify/helmet';
import fastifyCookie from '@fastify/cookie';
import { logger } from './utils/logger.js';

export function buildApp(options: FastifyServerOptions = {}): FastifyInstance {
  const app = Fastify({
    ...options,
    logger: false,
  });

  app.register(corsMiddleware);

  app.register(fastifyHelmet, {
    crossOriginOpenerPolicy: false,
    crossOriginEmbedderPolicy: false,
  });

  app.register(fastifyCookie);

  app.get('/', async (_request: FastifyRequest, _reply: FastifyReply) => {
    return 'Hello from sever.js of user-service';
  });

  // Health check route returning a JSON object
  app.get('/health', async (_request: FastifyRequest, reply: FastifyReply) => {
    reply.status(200).send({
      message: 'ok',
    });
  });

  app.setErrorHandler((error: FastifyError, request: FastifyRequest, reply: FastifyReply)=>{
    logger.error(error);
    reply.status(error.statusCode || 500).send({
        error: error?.name || "InternalServerError",
        message: error?.message || "Something went wrong",
    })
  });

  return app;
}
