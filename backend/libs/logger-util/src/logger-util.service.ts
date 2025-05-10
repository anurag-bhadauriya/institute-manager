import { Injectable, LoggerService, Type } from '@nestjs/common';
import * as winston from 'winston';
import { ConfigService } from '@nestjs/config';
import { AsyncContextManager } from '@app/app-initializer';
const LokiTransport = require("winston-loki");

/** Configuration interface for the logger */
export interface AsyncLoggerConfig {
    enableAsyncLogging: boolean;
    lokiUrl: string;
    application: string;
    environment: string;
}

export enum LOG_LEVELS {
    INFO = 'info',
    ERROR = 'error',
    WARN = 'warn',
    DEBUG = 'debug',
    VERBOSE = 'verbose'
}

@Injectable()
export class LoggerUtilService implements LoggerService {

    private logger: winston.Logger;
    private context: string;
    private requestId: string;
    private config: AsyncLoggerConfig;
    private timeZone: string;

    constructor(
        private readonly configService: ConfigService,
        private readonly asyncContext: AsyncContextManager
    ) {
        this.config = {
            enableAsyncLogging: this.configService.get('ENABLE_ASYNC_LOGS') === 'true',
            lokiUrl: this.configService.get('LOKI_URL') || 'http://localhost:3100',
            application: this.configService.get('APP_NAME') || 'nestjs-app',
            environment: this.configService.get('ENV_NAME') || 'development'
        };
        this.timeZone = this.configService.get('TIME_ZONE') || 'Asia/Calcutta';
        this.setupLogger(this.config);
        console.log('Logger initialized with configs: ', this.config);
    }

    // Set explicit configuration
    setConfig(config: Partial<AsyncLoggerConfig>): void {
        this.config = { ...this.config, ...config };
        this.setupLogger(this.config);
    }

    /** Set the current context (usually the service or controller name) */
    setContext(context: string): void {
        this.context = context;
    }

    /** Set a specific request ID (useful when you want to connect logs across services) */
    setRequestId(requestId: string): void {
        this.requestId = requestId;
    }

    /** Get the current request ID */
    getRequestId(): string {
        return this.requestId;
    }

    timezoned(): string {
        return new Date().toLocaleString('en-US', {
            timeZone: this.timeZone
        });
    }

    /** Initialize Winston logger with appropriate transports */
    private setupLogger(config: AsyncLoggerConfig): void {
        const transports: winston.transport[] = [
            // Always log to console
            new winston.transports.Console({
                format: winston.format.combine(
                    winston.format.timestamp({
                        format: this.timezoned
                    }),
                    winston.format.colorize(),
                    winston.format.printf(({ timestamp, level, message, context, requestId }) => {
                        return `${timestamp} [${level}] [${context}] [${requestId}]: ${message}`;
                    })
                ),
            }),
        ];

        // Add Loki transport if async logging is enabled
        if (config.enableAsyncLogging) {
            transports.push(
                new LokiTransport({
                    host: config.lokiUrl,
                    json: true,
                    labels: {
                        app: config.application,
                        environment: config.environment,
                    },
                    format: winston.format.json(),
                    debug: true
                })
            );
        }

        // Create Winston logger instance
        this.logger = winston.createLogger({
            level: LOG_LEVELS.DEBUG,
            format: winston.format.combine(
                winston.format.timestamp({
                    format: this.timezoned
                }),
                winston.format.json()
            ),
            defaultMeta: {
                app: config.application,
                environment: config.environment
            },
            transports,
        });
    }

    // Log methods that implement LoggerService interface
    log(message: any, context?: string): void {
        this.logWithLevel(LOG_LEVELS.INFO, message, context);
    }

    error(message: any, trace?: string, context?: string): void {
        const errorMessage = trace
            ? `${message} - ${trace}`
            : message;
        this.logWithLevel(LOG_LEVELS.ERROR, errorMessage, context);
    }

    warn(message: any, context?: string): void {
        this.logWithLevel(LOG_LEVELS.WARN, message, context);
    }

    debug(message: any, context?: string): void {
        this.logWithLevel(LOG_LEVELS.DEBUG, message, context);
    }

    verbose(message: any, context?: string): void {
        this.logWithLevel(LOG_LEVELS.VERBOSE, message, context);
    }

    /** Helper method to handle the actual logging */
    private logWithLevel(level: string, message: any, context?: string): void {
        const logContext = context || this.context;
        const requestId = this.asyncContext.getRequestId();

        // Handle objects and errors specially
        if (message instanceof Error) {
            this.logger.log({
                level,
                message: message.message,
                context: logContext,
                requestId: requestId,
                stack: message.stack,
            });
        } else if (typeof message === 'object') {
            this.logger.log({
                level,
                message: JSON.stringify(message),
                context: logContext,
                requestId: requestId,
            });
        } else {
            this.logger.log({
                level,
                message,
                context: logContext,
                requestId: requestId,
            });
        }
    }
}
