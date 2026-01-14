import { PaginatedResult, Result } from '@core';
import { Observable } from 'rxjs';

/**
 * Base repository interface
 * Abstraction for all data access - matches backend IRepository<T>
 */
export interface IBaseRepository<T> {
  getById(id: string): Observable<Result<T>>;
  getAll(pageNumber?: number, pageSize?: number): Observable<Result<PaginatedResult<T>>>;
  create(entity: T): Observable<Result<string>>;
  update(id: string, entity: T): Observable<Result<void>>;
  delete(id: string): Observable<Result<void>>;
}
