import { AppError, createValidationError } from './error';

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export function createAuthError(message: string): AuthError {
  return new AuthError(message);
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): boolean {
  return password.length >= 6;
}

export function validateUsername(username: string): boolean {
  return username.length >= 3 && username.length <= 20;
}

export function getValidationMessage(field: string, value: string): string | null {
  switch (field) {
    case 'email':
      if (!value) return 'Email is required';
      if (!validateEmail(value)) return 'Invalid email format';
      return null;

    case 'password':
      if (!value) return 'Password is required';
      if (!validatePassword(value)) return 'Password must be at least 6 characters';
      return null;

    case 'username':
      if (!value) return 'Username is required';
      if (!validateUsername(value)) return 'Username must be between 3 and 20 characters';
      return null;

    default:
      return null;
  }
}

export function validateDisplayName(displayName: string): void {
  if (displayName.length < 3) {
    throw createValidationError('Display name must be at least 3 characters long');
  }

  if (displayName.length > 30) {
    throw createValidationError('Display name must not exceed 30 characters');
  }

  if (!/^[a-zA-Z0-9_]+$/.test(displayName)) {
    throw createValidationError('Display name can only contain letters, numbers, and underscores');
  }
}

export function validatePredictionMethod(method: string): void {
  const validMethods = ['KO/TKO', 'Submission', 'Decision'];
  if (!validMethods.includes(method)) {
    throw createValidationError('Invalid prediction method');
  }
}

export function validateRound(round: number, maxRounds: number): void {
  if (!Number.isInteger(round) || round < 1 || round > maxRounds) {
    throw createValidationError(`Round must be between 1 and ${maxRounds}`);
  }
} 