import { FastifyReply } from "fastify"

export interface ApiResponseType<T = unknown>{
    success: boolean,
    message: string,
    data?: T
}

export const sendResponse = <T>(
    reply: FastifyReply,
    statusCode: number,
    message: string,
    data?: T
) => {
    const response: ApiResponseType<T> = {
        success: true,
        message: message,
        ...((data !== null || data !== undefined) && { data }),
    }

    return reply.status(statusCode).send(response);
}