/**
 * Result pattern matching backend Result<T>
 * Used for standardized API responses
 */
export class Result<T> {
  isSuccess: boolean;
  data: T | null;
  error: string | null;
  errors: string[];

  constructor(
    isSuccess: boolean,
    data: T | null = null,
    error: string | null = null,
    errors: string[] = []
  ) {
    this.isSuccess = isSuccess;
    this.data = data;
    this.error = error;
    this.errors = errors;
  }

  static success<T>(data: T): Result<T> {
    return new Result<T>(true, data);
  }

  static failure<T>(error: string, errors: string[] = []): Result<T> {
    return new Result<T>(false, null, error, errors);
  }
}
