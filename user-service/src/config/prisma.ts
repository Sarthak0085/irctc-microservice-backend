// import { PrismaClient } from '../generated/prisma/client.js';
// import { PrismaPg } from '@prisma/adapter-pg';
// import pg from 'pg';
// import { config } from './index.js'; // Ensure the extension is .js for NodeNext
// import { logger } from '../utils/logger.js';

// // Extend the global object type definition locally for safety
// const globalForPrisma = global as unknown as {
//     prisma: PrismaClient | undefined;
// };

// export class PrismaService {
//     private constructor() {}

//     public static getInstance(): PrismaClient {
//         if (!globalForPrisma.prisma) {
//             const connectionString = config.DATABASE_URL;

//             // Instantiate the native pg pool connection 
//             const pool = new pg.Pool({ connectionString });
//             const adapter = new PrismaPg(pool);

//             globalForPrisma.prisma = new PrismaClient({
//                 adapter,
//                 log: [
//                     { emit: 'event', level: 'error' },
//                     { emit: 'event', level: 'warn' },
//                 ] as const,
//             });

//             // Route standard Prisma events through your custom logger
//             globalForPrisma.prisma.$on('error', (e: any) => {
//                 logger.error('Prisma Error: ', e.message);
//             });

//             globalForPrisma.prisma.$on('warn', (e: any) => {
//                 logger.warn('Prisma Warning: ', e.message);
//             });
//         }

//         return globalForPrisma.prisma;
//     }

//     public static async close(): Promise<void> {
//         if (globalForPrisma.prisma) {
//             await globalForPrisma.prisma.$disconnect();
//             globalForPrisma.prisma = undefined;
//             logger.info('Database connection pool disconnected.');
//         }
//     }
// }

// export const prisma = PrismaService.getInstance();

import { PrismaClient, Prisma } from '../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import { config } from './index.js'; // Ensure the extension is .js for NodeNext
import { logger } from '../utils/logger.js';

// Extend the global object type definition locally for safety
const globalForPrisma = global as unknown as {
    prisma: PrismaClient | undefined;
};

export class PrismaService {
    private constructor() {}

    public static getInstance(): PrismaClient {
        if (!globalForPrisma.prisma) {
            const connectionString = config.DATABASE_URL;

            // Instantiate the native pg pool connection 
            const pool = new pg.Pool({ connectionString });
            const adapter = new PrismaPg(pool);

            globalForPrisma.prisma = new PrismaClient({
                adapter,
                log: [
                    { emit: 'event', level: 'error' },
                    { emit: 'event', level: 'warn' },
                ] as const, // 👈 Added "as const" here to fix the parameter type error
            });

            // Route standard Prisma events through your custom logger with explicit types
            //@ts-ignore
            globalForPrisma.prisma.$on('error', (e: Prisma.LogEvent) => {
                logger.error(`Prisma Error: ${e.message}`);
            });

            //@ts-ignore
            globalForPrisma.prisma.$on('warn', (e: Prisma.LogEvent) => {
                logger.warn(`Prisma Warning: ${e.message}`);
            });
        }

        return globalForPrisma.prisma;
    }

    public static async close(): Promise<void> {
        if (globalForPrisma.prisma) {
            await globalForPrisma.prisma.$disconnect();
            globalForPrisma.prisma = undefined;
            logger.info('Database connection pool disconnected.');
        }
    }
}

export const prisma = PrismaService.getInstance();
