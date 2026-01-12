import { describe, expect, it } from 'vitest';
import { Product } from './product.entity';

describe('Product Entity', () => {
  describe('constructor', () => {
    it('should create a product with default values', () => {
      const product = new Product();

      expect(product.name).toBe('');
      expect(product.description).toBeNull();
      expect(product.price).toBe(0);
      expect(product.sku).toBe('');
      expect(product.categoryId).toBeNull();
      expect(product.isActive).toBe(true);
      expect(product.stockQuantity).toBe(0);
    });

    it('should create a product with provided values', () => {
      const productData = {
        id: '123',
        name: 'Test Product',
        description: 'Test Description',
        price: 99.99,
        sku: 'TEST-SKU-001',
        categoryId: 'cat-123',
        isActive: false,
        stockQuantity: 50,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const product = new Product(productData);

      expect(product.id).toBe('123');
      expect(product.name).toBe('Test Product');
      expect(product.description).toBe('Test Description');
      expect(product.price).toBe(99.99);
      expect(product.sku).toBe('TEST-SKU-001');
      expect(product.categoryId).toBe('cat-123');
      expect(product.isActive).toBe(false);
      expect(product.stockQuantity).toBe(50);
    });

    it('should handle partial data', () => {
      const product = new Product({ name: 'Partial Product', price: 25.50 });

      expect(product.name).toBe('Partial Product');
      expect(product.price).toBe(25.50);
      expect(product.description).toBeNull();
      expect(product.sku).toBe('');
    });
  });

  describe('isValid', () => {
    it('should return true for valid product', () => {
      const product = new Product({
        name: 'Valid Product',
        price: 10.00,
        sku: 'SKU-001'
      });

      expect(product.isValid()).toBe(true);
    });

    it('should return false when name is empty', () => {
      const product = new Product({
        name: '',
        price: 10.00,
        sku: 'SKU-001'
      });

      expect(product.isValid()).toBe(false);
    });

    it('should return false when price is zero', () => {
      const product = new Product({
        name: 'Product',
        price: 0,
        sku: 'SKU-001'
      });

      expect(product.isValid()).toBe(false);
    });

    it('should return false when price is negative', () => {
      const product = new Product({
        name: 'Product',
        price: -5.00,
        sku: 'SKU-001'
      });

      expect(product.isValid()).toBe(false);
    });

    it('should return false when sku is empty', () => {
      const product = new Product({
        name: 'Product',
        price: 10.00,
        sku: ''
      });

      expect(product.isValid()).toBe(false);
    });
  });

  describe('isInStock', () => {
    it('should return true when product is active and has stock', () => {
      const product = new Product({
        name: 'In Stock Product',
        price: 10.00,
        sku: 'SKU-001',
        isActive: true,
        stockQuantity: 10
      });

      expect(product.isInStock()).toBe(true);
    });

    it('should return false when product is inactive', () => {
      const product = new Product({
        name: 'Inactive Product',
        price: 10.00,
        sku: 'SKU-001',
        isActive: false,
        stockQuantity: 10
      });

      expect(product.isInStock()).toBe(false);
    });

    it('should return false when stock is zero', () => {
      const product = new Product({
        name: 'Out of Stock',
        price: 10.00,
        sku: 'SKU-001',
        isActive: true,
        stockQuantity: 0
      });

      expect(product.isInStock()).toBe(false);
    });

    it('should return false when product is inactive and out of stock', () => {
      const product = new Product({
        name: 'Unavailable Product',
        price: 10.00,
        sku: 'SKU-001',
        isActive: false,
        stockQuantity: 0
      });

      expect(product.isInStock()).toBe(false);
    });
  });
});
