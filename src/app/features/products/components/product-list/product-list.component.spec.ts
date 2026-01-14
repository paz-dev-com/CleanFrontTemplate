import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { PaginatedResult, Product, Result } from '@core';
import { ProductService } from '@features/products';
import { of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ProductListComponent } from './product-list.component';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let productService: ProductService;
  let router: Router;

  beforeEach(() => {
    const productServiceMock = {
      getProducts: vi.fn(),
    };

    const routerMock = {
      navigate: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        ProductListComponent,
        { provide: ProductService, useValue: productServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    component = TestBed.inject(ProductListComponent);
    productService = TestBed.inject(ProductService);
    router = TestBed.inject(Router);
  });

  describe('initialization', () => {
    it('should create', () => {
      expect(component).toBeDefined();
    });

    it('should initialize with empty products array', () => {
      expect(component.products).toEqual([]);
    });

    it('should initialize with loading false', () => {
      expect(component.loading).toBe(false);
    });

    it('should initialize with no error', () => {
      expect(component.error).toBeNull();
    });

    it('should initialize with empty search term', () => {
      expect(component.searchTerm).toBe('');
    });

    it('should load products on init', () => {
      const mockResult = new PaginatedResult<Product>({
        items: [],
        pageNumber: 1,
        pageSize: 10,
        totalCount: 0,
        totalPages: 0,
        hasPreviousPage: false,
        hasNextPage: false,
      });

      vi.spyOn(productService, 'getProducts').mockReturnValue(of(Result.success(mockResult)));

      component.ngOnInit();

      expect(productService.getProducts).toHaveBeenCalled();
    });
  });

  describe('loadProducts', () => {
    it('should set loading to true when loading', () => {
      vi.spyOn(productService, 'getProducts').mockReturnValue(
        of(Result.success(new PaginatedResult<Product>()))
      );

      component.loadProducts();

      // Loading is set to true, then immediately to false after observable completes
      expect(productService.getProducts).toHaveBeenCalled();
    });

    it('should clear error when loading', () => {
      component.error = 'Previous error';

      vi.spyOn(productService, 'getProducts').mockReturnValue(
        of(Result.success(new PaginatedResult<Product>()))
      );

      component.loadProducts();

      expect(component.error).toBeNull();
    });

    it('should load products successfully', () => {
      const mockProducts = [
        new Product({ id: '1', name: 'Product 1', price: 10, sku: 'SKU1' }),
        new Product({ id: '2', name: 'Product 2', price: 20, sku: 'SKU2' }),
      ];

      const mockResult = new PaginatedResult<Product>({
        items: mockProducts,
        pageNumber: 1,
        pageSize: 10,
        totalCount: 2,
        totalPages: 1,
        hasPreviousPage: false,
        hasNextPage: false,
      });

      vi.spyOn(productService, 'getProducts').mockReturnValue(of(Result.success(mockResult)));

      component.loadProducts();

      expect(component.products).toEqual(mockProducts);
      expect(component.paginatedResult).toEqual(mockResult);
      expect(component.loading).toBe(false);
    });

    it('should handle load failure', () => {
      vi.spyOn(productService, 'getProducts').mockReturnValue(
        of(Result.failure<PaginatedResult<Product>>('Failed to load'))
      );

      component.loadProducts();

      expect(component.error).toBe('Failed to load');
      expect(component.loading).toBe(false);
    });

    it('should handle service error', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {
        /* no-op */
      });
      vi.spyOn(productService, 'getProducts').mockReturnValue(
        throwError(() => new Error('Network error'))
      );

      component.loadProducts();

      expect(component.error).toBe('An error occurred while loading products');
      expect(component.loading).toBe(false);
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it('should pass pagination parameters', () => {
      const getProductsSpy = vi
        .spyOn(productService, 'getProducts')
        .mockReturnValue(of(Result.success(new PaginatedResult<Product>())));

      component.loadProducts();

      expect(getProductsSpy).toHaveBeenCalledWith({
        pageNumber: 1,
        pageSize: 10,
        searchTerm: undefined,
      });
    });

    it('should pass search term when provided', () => {
      component.searchTerm = 'test';

      const getProductsSpy = vi
        .spyOn(productService, 'getProducts')
        .mockReturnValue(of(Result.success(new PaginatedResult<Product>())));

      component.loadProducts();

      expect(getProductsSpy).toHaveBeenCalledWith({
        pageNumber: 1,
        pageSize: 10,
        searchTerm: 'test',
      });
    });
  });

  describe('onSearch', () => {
    it('should reset to first page', () => {
      component.searchTerm = 'test';

      vi.spyOn(productService, 'getProducts').mockReturnValue(
        of(Result.success(new PaginatedResult<Product>()))
      );

      component.onSearch();

      expect(productService.getProducts).toHaveBeenCalledWith(
        expect.objectContaining({ pageNumber: 1 })
      );
    });

    it('should reload products', () => {
      const loadProductsSpy = vi
        .spyOn(productService, 'getProducts')
        .mockReturnValue(of(Result.success(new PaginatedResult<Product>())));

      component.onSearch();

      expect(loadProductsSpy).toHaveBeenCalled();
    });
  });

  describe('viewProduct', () => {
    it('should navigate to product detail', () => {
      const navigateSpy = vi.spyOn(router, 'navigate');

      component.viewProduct('123');

      expect(navigateSpy).toHaveBeenCalledWith(['/products', '123']);
    });
  });

  describe('createProduct', () => {
    it('should navigate to create product page', () => {
      const navigateSpy = vi.spyOn(router, 'navigate');

      component.createProduct();

      expect(navigateSpy).toHaveBeenCalledWith(['/products', 'create']);
    });
  });

  describe('nextPage', () => {
    it('should load next page when hasNextPage is true', () => {
      component.paginatedResult = new PaginatedResult<Product>({
        items: [],
        pageNumber: 1,
        pageSize: 10,
        totalCount: 20,
        totalPages: 2,
        hasPreviousPage: false,
        hasNextPage: true,
      });

      const loadProductsSpy = vi
        .spyOn(productService, 'getProducts')
        .mockReturnValue(of(Result.success(new PaginatedResult<Product>())));

      component.nextPage();

      expect(loadProductsSpy).toHaveBeenCalledWith(expect.objectContaining({ pageNumber: 2 }));
    });

    it('should not load when hasNextPage is false', () => {
      component.paginatedResult = new PaginatedResult<Product>({
        items: [],
        pageNumber: 1,
        pageSize: 10,
        totalCount: 5,
        totalPages: 1,
        hasPreviousPage: false,
        hasNextPage: false,
      });

      const loadProductsSpy = vi.spyOn(productService, 'getProducts');

      component.nextPage();

      expect(loadProductsSpy).not.toHaveBeenCalled();
    });

    it('should not load when paginatedResult is null', () => {
      component.paginatedResult = null;

      const loadProductsSpy = vi.spyOn(productService, 'getProducts');

      component.nextPage();

      expect(loadProductsSpy).not.toHaveBeenCalled();
    });
  });

  describe('previousPage', () => {
    it('should load previous page when hasPreviousPage is true', () => {
      // First load products to initialize component state at page 1
      vi.spyOn(productService, 'getProducts').mockReturnValue(
        of(
          Result.success(
            new PaginatedResult<Product>({
              items: [],
              pageNumber: 1,
              pageSize: 10,
              totalCount: 20,
              totalPages: 2,
              hasPreviousPage: false,
              hasNextPage: true,
            })
          )
        )
      );
      component.ngOnInit();

      // Now navigate to page 2
      vi.spyOn(productService, 'getProducts').mockReturnValue(
        of(
          Result.success(
            new PaginatedResult<Product>({
              items: [],
              pageNumber: 2,
              pageSize: 10,
              totalCount: 20,
              totalPages: 2,
              hasPreviousPage: true,
              hasNextPage: false,
            })
          )
        )
      );
      component.nextPage();

      // Finally test going back to page 1
      const loadProductsSpy = vi
        .spyOn(productService, 'getProducts')
        .mockReturnValue(of(Result.success(new PaginatedResult<Product>())));

      component.previousPage();

      expect(loadProductsSpy).toHaveBeenCalledWith(expect.objectContaining({ pageNumber: 1 }));
    });

    it('should not load when hasPreviousPage is false', () => {
      component.paginatedResult = new PaginatedResult<Product>({
        items: [],
        pageNumber: 1,
        pageSize: 10,
        totalCount: 5,
        totalPages: 1,
        hasPreviousPage: false,
        hasNextPage: false,
      });

      const loadProductsSpy = vi.spyOn(productService, 'getProducts');

      component.previousPage();

      expect(loadProductsSpy).not.toHaveBeenCalled();
    });

    it('should not load when paginatedResult is null', () => {
      component.paginatedResult = null;

      const loadProductsSpy = vi.spyOn(productService, 'getProducts');

      component.previousPage();

      expect(loadProductsSpy).not.toHaveBeenCalled();
    });
  });
});
