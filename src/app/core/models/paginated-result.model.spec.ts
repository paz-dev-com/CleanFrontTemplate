import { describe, expect, it } from 'vitest';
import { PaginatedResult } from './paginated-result.model';

describe('PaginatedResult Model', () => {
  describe('constructor', () => {
    it('should create with default values', () => {
      const result = new PaginatedResult<string>();

      expect(result.items).toEqual([]);
      expect(result.pageNumber).toBe(1);
      expect(result.pageSize).toBe(10);
      expect(result.totalPages).toBe(0);
      expect(result.totalCount).toBe(0);
      expect(result.hasPreviousPage).toBe(false);
      expect(result.hasNextPage).toBe(false);
    });

    it('should create with provided values', () => {
      const data = {
        items: ['item1', 'item2', 'item3'],
        pageNumber: 2,
        pageSize: 20,
        totalPages: 5,
        totalCount: 100,
        hasPreviousPage: true,
        hasNextPage: true,
      };

      const result = new PaginatedResult<string>(data);

      expect(result.items).toEqual(['item1', 'item2', 'item3']);
      expect(result.pageNumber).toBe(2);
      expect(result.pageSize).toBe(20);
      expect(result.totalPages).toBe(5);
      expect(result.totalCount).toBe(100);
      expect(result.hasPreviousPage).toBe(true);
      expect(result.hasNextPage).toBe(true);
    });

    it('should handle partial data', () => {
      const result = new PaginatedResult<number>({
        items: [1, 2, 3],
        pageNumber: 1,
        totalCount: 3,
      });

      expect(result.items).toEqual([1, 2, 3]);
      expect(result.pageNumber).toBe(1);
      expect(result.pageSize).toBe(10); // default
      expect(result.totalCount).toBe(3);
      expect(result.totalPages).toBe(0); // default
    });
  });

  describe('pagination flags', () => {
    it('should indicate first page correctly', () => {
      const result = new PaginatedResult({
        items: [1, 2, 3],
        pageNumber: 1,
        pageSize: 10,
        totalPages: 3,
        totalCount: 30,
        hasPreviousPage: false,
        hasNextPage: true,
      });

      expect(result.hasPreviousPage).toBe(false);
      expect(result.hasNextPage).toBe(true);
    });

    it('should indicate middle page correctly', () => {
      const result = new PaginatedResult({
        items: [1, 2, 3],
        pageNumber: 2,
        pageSize: 10,
        totalPages: 3,
        totalCount: 30,
        hasPreviousPage: true,
        hasNextPage: true,
      });

      expect(result.hasPreviousPage).toBe(true);
      expect(result.hasNextPage).toBe(true);
    });

    it('should indicate last page correctly', () => {
      const result = new PaginatedResult({
        items: [1, 2, 3],
        pageNumber: 3,
        pageSize: 10,
        totalPages: 3,
        totalCount: 30,
        hasPreviousPage: true,
        hasNextPage: false,
      });

      expect(result.hasPreviousPage).toBe(true);
      expect(result.hasNextPage).toBe(false);
    });

    it('should indicate single page correctly', () => {
      const result = new PaginatedResult({
        items: [1, 2, 3],
        pageNumber: 1,
        pageSize: 10,
        totalPages: 1,
        totalCount: 3,
        hasPreviousPage: false,
        hasNextPage: false,
      });

      expect(result.hasPreviousPage).toBe(false);
      expect(result.hasNextPage).toBe(false);
    });
  });

  describe('type safety', () => {
    it('should work with object types', () => {
      interface Product {
        id: string;
        name: string;
      }

      const products: Product[] = [
        { id: '1', name: 'Product 1' },
        { id: '2', name: 'Product 2' },
      ];

      const result = new PaginatedResult<Product>({
        items: products,
        pageNumber: 1,
        pageSize: 10,
        totalCount: 2,
        totalPages: 1,
        hasPreviousPage: false,
        hasNextPage: false,
      });

      expect(result.items).toEqual(products);
      expect(result.items[0].name).toBe('Product 1');
    });

    it('should work with primitive types', () => {
      const numbers = new PaginatedResult<number>({
        items: [1, 2, 3, 4, 5],
        totalCount: 5,
      });

      expect(numbers.items).toEqual([1, 2, 3, 4, 5]);
    });
  });

  describe('empty result', () => {
    it('should handle empty items', () => {
      const result = new PaginatedResult<string>({
        items: [],
        pageNumber: 1,
        pageSize: 10,
        totalPages: 0,
        totalCount: 0,
        hasPreviousPage: false,
        hasNextPage: false,
      });

      expect(result.items).toEqual([]);
      expect(result.totalCount).toBe(0);
      expect(result.totalPages).toBe(0);
    });
  });
});
