import { FastifyInstance, FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import { logger } from "../utils/logger.js";
import fp from "fastify-plugin";

const reqLoggerPlugin: FastifyPluginAsync = async (fastify: FastifyInstance) => {
    // 1. Log incoming request at debuig level
    fastify.addHook("onRequest", async (request: FastifyRequest)=>{
        logger.debug(`[${request.method}] ${request.url}`);
    });    

    // 2. Log finished request with status code & timing at INFO level
    fastify.addHook("onResponse", async (request: FastifyRequest, reply: FastifyReply)=>{
        const duration = reply.elapsedTime.toFixed(2);
        logger.info(`[${request.method}] ${request.url} - status: ${reply.statusCode} - ${duration}ms`);
    });    
}

export default fp(reqLoggerPlugin);