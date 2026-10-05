import "dotenv/config";
import { buildApp } from "./app.js";
import { config } from "./config/index.js";
import { logger } from "./utils/logger.js";


const startServer = async(): Promise<void> => {
    const app = buildApp();

    try {
        await app.listen({
            port: config.PORT,
            host: '0.0.0.0',
        });

        logger.info(`${config.SERVICE_NAME} is running on http://localhost:${config.PORT}`);

        // Graceful Shutdown Handler
        const shutdown = async (signal: string): Promise<void> => {
            logger.info(`Received ${signal}. Shutting down gracefully...`);
            try {
                await app.close(); // Gracefully closes Fastify server and ongoing requests
                logger.info('Server and background services closed successfully');
                process.exit(0);
            } catch (err) {
                logger.error('Error during shutdown:', err);
                process.exit(1);
            }
        };

        process.on('SIGTERM', () => shutdown('SIGTERM'));
        process.on('SIGINT', () => shutdown('SIGINT'));

    } catch (error) {
        logger.error('Failed to Start Server:', error);
        process.exit(1);
    }
}

startServer();