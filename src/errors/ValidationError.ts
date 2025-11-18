// src/errors/ValidationError.ts
export class ValidationError extends Error {
  public readonly errors: Record<string, string[]>;

  constructor(fieldErrors: Record<string, string[]>) {
    super('Validation failed');
    this.name = 'ValidationError';
    this.errors = fieldErrors;
  }
}