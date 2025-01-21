/**
 * Custom error classes and error handling utilities
 */

// Custom error classes
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code: string = 'API_ERROR'
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public field?: string
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NetworkError extends Error {
  constructor(message: string = 'Network error occurred') {
    super(message);
    this.name = 'NetworkError';
  }
}

// Error logging utility
export function logError(error: Error, context: Record<string, any> = {}) {
  const timestamp = new Date().toISOString();
  const errorLog = {
    timestamp,
    name: error.name,
    message: error.message,
    stack: error.stack,
    ...context,
  };

  // In development, log to console
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', errorLog);
  }

  // In production, you might want to send this to a logging service
  // Example: await sendToLoggingService(errorLog);
}

// Error handler wrapper
export async function handleError<T>(
  promise: Promise<T>,
  context: Record<string, any> = {}
): Promise<[T | null, Error | null]> {
  try {
    const data = await promise;
    return [data, null];
  } catch (error) {
    const typedError = error instanceof Error ? error : new Error(String(error));
    logError(typedError, context);
    return [null, typedError];
  }
}

// Validation utilities
export function validateId(id: string): boolean {
  return typeof id === 'string' && id.length > 0;
}

export function validatePrice(price: number): boolean {
  return typeof price === 'number' && price >= 0;
}

export function validateQuantity(quantity: number): boolean {
  return typeof quantity === 'number' && quantity >= 0 && Number.isInteger(quantity);
} 