import { Injectable, LoggerService, Type } from '@nestjs/common';
import * as winston from 'winston';
import { v4 as uuidv4 } from 'uuid';
const LokiTransport = require("winston-loki");

/** Configuration interface for the logger */
export interface AsyncLoggerConfig {
    enableAsyncLogging: boolean;
    lokiUrl: string;
    application: string;
    environment: string;
}

export interface LoggerModuleAsyncOptions {
    imports?: Type<unknown>[],
    inject?: Type<unknown>[],
    useFactory: (...args: unknown[]) => Promise<AsyncLoggerConfig> | Partial<AsyncLoggerConfig>
}

@Injectable()
export class LoggerUtilService implements LoggerService {

    private logger: winston.Logger;
    private context: string;
    private requestId: string;
    private config: AsyncLoggerConfig;

    constructor() {
        // Default configuration if not provided
        this.config = {
            enableAsyncLogging: process.env.ENABLE_ASYNC_LOGGING === 'true',
            lokiUrl: process.env.LOKI_URL || 'http://localhost:3100',
            application: process.env.APP_NAME || 'nestjs-app',
            environment: process.env.NODE_ENV || 'development'
        };

        this.setupLogger();
        this.requestId = uuidv4();
    }

    // Set explicit configuration
    setConfig(config: Partial<AsyncLoggerConfig>): void {
        this.config = { ...this.config, ...config };
        console.log('Configs are: ', this.config);
        this.setupLogger();
    }

    // Set the current context (usually the service or controller name)
    setContext(context: string): void {
        this.context = context;
    }

    // Set a specific request ID (useful when you want to connect logs across services)
    setRequestId(requestId: string): void {
        this.requestId = requestId;
    }

    // Get the current request ID
    getRequestId(): string {
        return this.requestId;
    }

    // Initialize Winston logger with appropriate transports
    private setupLogger(): void {
        const transports: winston.transport[] = [
            // Always log to console
            new winston.transports.Console({
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.colorize(),
                    winston.format.printf(({ timestamp, level, message, context, requestId }) => {
                        return `${timestamp} [${level}] [${context || this.context || 'Global'}] [${requestId || this.requestId}]: ${message}`;
                    })
                ),
            }),
        ];

        // Add Loki transport if async logging is enabled
        if (this.config.enableAsyncLogging) {
            transports.push(
                new LokiTransport({
                    host: this.config.lokiUrl,
                    json: true,
                    labels: {
                        app: this.config.application,
                        environment: this.config.environment,
                    },
                    format: winston.format.json(),
                })
            );
        }

        // Create Winston logger instance
        this.logger = winston.createLogger({
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            ),
            defaultMeta: {
                context: this.context || 'Global',
                requestId: this.requestId,
            },
            transports,
        });
    }

    // Log methods that implement LoggerService interface
    log(message: any, context?: string): void {
        this.logWithLevel('info', message, context);
    }

    error(message: any, trace?: string, context?: string): void {
        const errorMessage = trace
            ? `${message} - ${trace}`
            : message;
        this.logWithLevel('error', errorMessage, context);
    }

    warn(message: any, context?: string): void {
        this.logWithLevel('warn', message, context);
    }

    debug(message: any, context?: string): void {
        this.logWithLevel('debug', message, context);
    }

    verbose(message: any, context?: string): void {
        this.logWithLevel('verbose', message, context);
    }

    // Helper method to handle the actual logging
    private logWithLevel(level: string, message: any, context?: string): void {
        const logContext = context || this.context;

        // Handle objects and errors specially
        if (message instanceof Error) {
            this.logger.log({
                level,
                message: message.message,
                context: logContext,
                requestId: this.requestId,
                stack: message.stack,
            });
        } else if (typeof message === 'object') {
            this.logger.log({
                level,
                message: JSON.stringify(message),
                context: logContext,
                requestId: this.requestId,
            });
        } else {
            this.logger.log({
                level,
                message,
                context: logContext,
                requestId: this.requestId,
            });
        }
    }
}
