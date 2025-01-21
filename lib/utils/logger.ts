/**
 * Logging utility for consistent logging across the application
 * Supports different log levels and environments
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  error?: Error;
}

class Logger {
  private static instance: Logger;
  private logBuffer: LogEntry[] = [];
  private readonly MAX_BUFFER_SIZE = 100;

  private constructor() {
    // Private constructor for singleton pattern
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatLogEntry(entry: LogEntry): string {
    const { timestamp, level, message, context, error } = entry;
    let logMessage = `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    
    if (context && Object.keys(context).length > 0) {
      logMessage += `\nContext: ${JSON.stringify(context, null, 2)}`;
    }
    
    if (error) {
      logMessage += `\nError: ${error.message}\nStack: ${error.stack}`;
    }
    
    return logMessage;
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: Record<string, any>,
    error?: Error
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      error,
    };
  }

  private addToBuffer(entry: LogEntry) {
    this.logBuffer.push(entry);
    if (this.logBuffer.length > this.MAX_BUFFER_SIZE) {
      this.logBuffer.shift();
    }
  }

  debug(message: string, context?: Record<string, any>) {
    if (process.env.NODE_ENV === 'development') {
      const entry = this.createLogEntry('debug', message, context);
      this.addToBuffer(entry);
      console.debug(this.formatLogEntry(entry));
    }
  }

  info(message: string, context?: Record<string, any>) {
    const entry = this.createLogEntry('info', message, context);
    this.addToBuffer(entry);
    console.info(this.formatLogEntry(entry));
  }

  warn(message: string, context?: Record<string, any>) {
    const entry = this.createLogEntry('warn', message, context);
    this.addToBuffer(entry);
    console.warn(this.formatLogEntry(entry));
  }

  error(message: string, error?: Error, context?: Record<string, any>) {
    const entry = this.createLogEntry('error', message, context, error);
    this.addToBuffer(entry);
    console.error(this.formatLogEntry(entry));

    // In production, you might want to send this to an error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Example: await this.sendToErrorTrackingService(entry);
    }
  }

  getRecentLogs(count: number = 10): LogEntry[] {
    return this.logBuffer.slice(-count);
  }

  clearLogs() {
    this.logBuffer = [];
  }

  // Example method for sending logs to an external service
  private async sendToErrorTrackingService(entry: LogEntry) {
    try {
      // Implementation would go here
      // Example:
      // await fetch('your-error-tracking-service', {
      //   method: 'POST',
      //   body: JSON.stringify(entry),
      // });
    } catch (error) {
      console.error('Failed to send log to error tracking service:', error);
    }
  }
}

// Export singleton instance
export const logger = Logger.getInstance(); 