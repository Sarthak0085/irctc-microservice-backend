import winston from 'winston';
import { config } from '../config/index.js';

const { combine, timestamp, printf, colorize, errors, json } = winston.format;

// 1. Development Format: Human-readable, colored, text-based format
const devFormat = combine(
  colorize(),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  errors({ stack: true }),
  // Implements the exact custom format: [timestamp] [level] [service]: message (with stack trace fallback)
  printf(({ timestamp, level, message, service, stack }) => {
    const serviceName = service ? `[${service}]` : `[${config.SERVICE_NAME || 'user-service'}]`;
    const logMessage = stack ?? message;
    return `[${timestamp}] [${level}] ${serviceName}: ${logMessage}`;
  }),
);

// 2. Production Format: Highly optimized, machine-readable JSON structure
const prodFormat = combine(
  timestamp(), 
  errors({ stack: true }), 
  json()
);

// 3. Create the final unified instance with asynchronous file transports
export const logger = winston.createLogger({
  level: config.LOG_LEVEL || 'info',
  // Dynamic toggle depending on the active node environment
  format: config.NODE_ENV === "production" ? prodFormat : devFormat,
  defaultMeta: { service: config.SERVICE_NAME || 'user-service' },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
  exitOnError: false,
});
