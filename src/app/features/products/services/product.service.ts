import { Injectable, inject } from '@angular/core';
import { IProductRepository, PaginatedResult, Product, Result } from '@core';
import {
  CreateProductCommand,
  DeleteProductCommand,
  GetProductByIdQuery,
  GetProductsQuery,
  UpdateProductCommand,
} from '@features/products';
import { Observable } from 'rxjs';

/**
 * Product Service (Use Case Handler)
 * Orchestrates business logic for product operations
 * Depends ONLY on abstractions from Core layer
 */
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly productRepository = inject(IProductRepository);

  // Query Handlers (Read Operations)

  getProducts(query: GetProductsQuery): Observable<Result<PaginatedResult<Product>>> {
    if (query.searchTerm) {
      return this.productRepository.search(query.searchTerm, query.pageNumber, query.pageSize);
    }

    if (query.categoryId) {
      return this.productRepository.getByCategory(
        query.categoryId,
        query.pageNumber,
        query.pageSize
      );
    }

    return this.productRepository.getAll(query.pageNumber, query.pageSize);
  }

  getProductById(query: GetProductByIdQuery): Observable<Result<Product>> {
    return this.productRepository.getById(query.id);
  }

  // Command Handlers (Write Operations)

  createProduct(command: CreateProductCommand): Observable<Result<string>> {
    const product = new Product({
      name: command.name,
      description: command.description,
      price: command.price,
      sku: command.sku,
      categoryId: command.categoryId,
      stockQuantity: command.stockQuantity,
    });

    // Domain validation
    if (!product.isValid()) {
      return new Observable((observer) => {
        observer.next(Result.failure('Invalid product data'));
        observer.complete();
      });
    }

    return this.productRepository.create(product);
  }

  updateProduct(command: UpdateProductCommand): Observable<Result<void>> {
    const product = new Product(command);

    if (!product.isValid()) {
      return new Observable((observer) => {
        observer.next(Result.failure('Invalid product data'));
        observer.complete();
      });
    }

    return this.productRepository.update(command.id, product);
  }

  deleteProduct(command: DeleteProductCommand): Observable<Result<void>> {
    return this.productRepository.delete(command.id);
  }
}
