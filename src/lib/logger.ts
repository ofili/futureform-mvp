// Logging utility for services

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogContext {
    service: string;
    method: string;
    userId?: string;
    organizationId?: string;
    [key: string]: any;
}

class Logger {
    private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
        const timestamp = new Date().toISOString();
        const contextStr = context ? JSON.stringify(context) : '';
        return `[${timestamp}] [${level.toUpperCase()}] ${message} ${contextStr}`;
    }

    info(message: string, context?: LogContext) {
        console.log(this.formatMessage('info', message, context));
    }

    warn(message: string, context?: LogContext) {
        console.warn(this.formatMessage('warn', message, context));
    }

    error(message: string, error?: Error, context?: LogContext) {
        const errorContext = error ? { ...context, error: error.message, stack: error.stack } : context;
        console.error(this.formatMessage('error', message, errorContext));
    }

    debug(message: string, context?: LogContext) {
        if (process.env.NODE_ENV === 'development') {
            console.debug(this.formatMessage('debug', message, context));
        }
    }
}

export const logger = new Logger();
export type { LogContext };
