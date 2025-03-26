export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export function createNotFoundError(message: string): NotFoundError {
  return new NotFoundError(message);
}

export function isNotFoundError(error: unknown): error is NotFoundError {
  return error instanceof NotFoundError;
} 