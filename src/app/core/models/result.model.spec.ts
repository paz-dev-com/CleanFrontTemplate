import { describe, expect, it } from 'vitest';
import { Result } from './result.model';

describe('Result Model', () => {
  describe('constructor', () => {
    it('should create a successful result with data', () => {
      const data = { id: '1', name: 'Test' };
      const result = new Result(true, data);

      expect(result.isSuccess).toBe(true);
      expect(result.data).toEqual(data);
      expect(result.error).toBeNull();
      expect(result.errors).toEqual([]);
    });

    it('should create a failed result with error', () => {
      const error = 'Something went wrong';
      const errors = ['Error 1', 'Error 2'];
      const result = new Result(false, null, error, errors);

      expect(result.isSuccess).toBe(false);
      expect(result.data).toBeNull();
      expect(result.error).toBe(error);
      expect(result.errors).toEqual(errors);
    });

    it('should handle minimal parameters', () => {
      const result = new Result(true);

      expect(result.isSuccess).toBe(true);
      expect(result.data).toBeNull();
      expect(result.error).toBeNull();
      expect(result.errors).toEqual([]);
    });
  });

  describe('success factory method', () => {
    it('should create a successful result with data', () => {
      const data = { value: 42 };
      const result = Result.success(data);

      expect(result.isSuccess).toBe(true);
      expect(result.data).toEqual(data);
      expect(result.error).toBeNull();
      expect(result.errors).toEqual([]);
    });

    it('should work with string data', () => {
      const result = Result.success('Success message');

      expect(result.isSuccess).toBe(true);
      expect(result.data).toBe('Success message');
    });

    it('should work with number data', () => {
      const result = Result.success(123);

      expect(result.isSuccess).toBe(true);
      expect(result.data).toBe(123);
    });

    it('should work with array data', () => {
      const data = [1, 2, 3];
      const result = Result.success(data);

      expect(result.isSuccess).toBe(true);
      expect(result.data).toEqual(data);
    });
  });

  describe('failure factory method', () => {
    it('should create a failed result with error message', () => {
      const error = 'Operation failed';
      const result = Result.failure(error);

      expect(result.isSuccess).toBe(false);
      expect(result.data).toBeNull();
      expect(result.error).toBe(error);
      expect(result.errors).toEqual([]);
    });

    it('should create a failed result with error message and errors array', () => {
      const error = 'Validation failed';
      const errors = ['Name is required', 'Email is invalid'];
      const result = Result.failure(error, errors);

      expect(result.isSuccess).toBe(false);
      expect(result.data).toBeNull();
      expect(result.error).toBe(error);
      expect(result.errors).toEqual(errors);
    });

    it('should handle empty errors array', () => {
      const result = Result.failure('Error', []);

      expect(result.isSuccess).toBe(false);
      expect(result.errors).toEqual([]);
    });
  });

  describe('type safety', () => {
    it('should maintain type information for data', () => {
      interface User {
        id: string;
        name: string;
      }

      const user: User = { id: '1', name: 'John' };
      const result = Result.success<User>(user);

      expect(result.data).toEqual(user);
      if (result.data) {
        expect(result.data.name).toBe('John');
      }
    });
  });
});
