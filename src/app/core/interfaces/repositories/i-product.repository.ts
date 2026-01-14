import { InjectionToken } from '@angular/core';
import { PaginatedResult, Product, Result } from '@core';
import { Observable } from 'rxjs';
import { IBaseRepository } from './i-base.repository';

/**
 * Product repository interface
 * Abstraction for product data access
 */
export interface IProductRepository extends IBaseRepository<Product> {
  search(
    searchTerm: string,
    pageNumber?: number,
    pageSize?: number
  ): Observable<Result<PaginatedResult<Product>>>;
  getByCategory(
    categoryId: string,
    pageNumber?: number,
    pageSize?: number
  ): Observable<Result<PaginatedResult<Product>>>;
}

/**
 * Injection token for IProductRepository
 * Used for dependency injection in Angular
 */
export const IProductRepository = new InjectionToken<IProductRepository>('IProductRepository');
