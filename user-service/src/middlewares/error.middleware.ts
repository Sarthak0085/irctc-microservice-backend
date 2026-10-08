import { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { hasZodFastifySchemaValidationErrors } from "fastify-type-provider-zod";
import { ApiErrorType } from "../utils/error-types.js";
import { ZodError } from "zod";
import { AppError } from "../utils/error.js";
import { Prisma } from "../generated/prisma/client.js";

export const globalErrorMiddleware = (
    error: FastifyError | Error,
    _request: FastifyRequest,
    reply: FastifyReply
) => {
    if(hasZodFastifySchemaValidationErrors(error)){
        return reply.status(400).send({
            success: false,
            error: ApiErrorType.BAD_REQUEST,
            message: "Inavlid request payload",
            details: error.validation?.map((issue: any)=>{
                const path = issue.params?.issue?.path?.join(".") || "field";
                const message = issue?.params?.issue?.message || issue?.message;
                return {
                    field: path,
                    message,
                }
            })
        });
    }

    if(error instanceof ZodError){
        return reply.status(400).send({
            success: false,
            error: ApiErrorType.BAD_REQUEST,
            message: "Invalid request payload",
            details: error?.issues?.map((issue)=>({
                field: issue?.path?.join("."),
                message: issue?.message
            }))
        })
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Unique constraint violation (P2002)
        if (error.code === 'P2002') {
            const target = (error.meta?.target as string[])?.join(', ') || 'field';
            return reply.status(409).send({
                success: false,
                error: ApiErrorType.DUPLICATE_ENTRY,
                message: `A record with this ${target} already exists.`,
            });
        }
    }

    if(error instanceof AppError){
        return reply.status(error?.statusCode).send({
            success: false,
            error: error?.code,
            message: error?.message,
        })
    };

    return reply.status(500).send({
        success: false,
        error: ApiErrorType.INTERNAL_SERVER_ERROR,
        message: error?.message ?? "Something went wrong"
    });
}