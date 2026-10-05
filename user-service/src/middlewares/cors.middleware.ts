import fastifyCors from '@fastify/cors';
import { config } from '../config/index.js';
import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

const allowedOrigins = config.ALLOWED_ORIGINS
  ? config.ALLOWED_ORIGINS.split(',').map((o: string) => o.trim())
  : [];

const corsMiddlewarePlugin: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  await fastify.register(fastifyCors, {
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'), false);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
};

export const corsMiddleware = fp(corsMiddlewarePlugin);
