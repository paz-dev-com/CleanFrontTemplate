import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../../entities/product.entity';
import { PaginatedResult } from '../../models/paginated-result.model';
import { Result } from '../../models/result.model';
import { IBaseRepository } from './i-base.repository';

/**
 * Product repository interface
 * Abstraction for product data access
 */
export interface IProductRepository extends IBaseRepository<Product> {
  search(searchTerm: string, pageNumber?: number, pageSize?: number): Observable<Result<PaginatedResult<Product>>>;
  getByCategory(categoryId: string, pageNumber?: number, pageSize?: number): Observable<Result<PaginatedResult<Product>>>;
}

/**
 * Injection token for IProductRepository
 * Used for dependency injection in Angular
 */
export const IProductRepository = new InjectionToken<IProductRepository>('IProductRepository');
