export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const errorCodes = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
} as const;

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

export function handleError(error: unknown): AppError {
  if (isAppError(error)) {
    return error;
  }

  if (error instanceof Error) {
    return new AppError(
      error.message,
      errorCodes.SERVER_ERROR,
      500
    );
  }

  return new AppError(
    'An unexpected error occurred',
    errorCodes.SERVER_ERROR,
    500
  );
}

export function createValidationError(message: string): AppError {
  return new AppError(
    message,
    errorCodes.VALIDATION_ERROR,
    400
  );
}

export function createAuthError(message: string = 'Unauthorized'): AppError {
  return new AppError(
    message,
    errorCodes.UNAUTHORIZED,
    401
  );
}

export function createNotFoundError(message: string): AppError {
  return new AppError(
    message,
    errorCodes.NOT_FOUND,
    404
  );
} 