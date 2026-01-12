import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { IProductRepository, PaginatedResult, Product, Result } from '../../core';

/**
 * Product HTTP Repository (Infrastructure Implementation)
 * Implements IProductRepository using HttpClient
 * Maps backend API responses to domain models
 */
@Injectable({
  providedIn: 'root'
})
export class ProductHttpRepository implements IProductRepository {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/products`;

  getById(id: string): Observable<Result<Product>> {
    return this.http.get<Result<any>>(`${this.baseUrl}/${id}`).pipe(
      map(response => {
        if (response.isSuccess && response.data) {
          return Result.success(new Product(response.data));
        }
        return Result.failure<Product>(response.error || 'Failed to fetch product');
      })
    );
  }

  getAll(pageNumber = 1, pageSize = 10): Observable<Result<PaginatedResult<Product>>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<Result<any>>(`${this.baseUrl}`, { params }).pipe(
      map(response => {
        if (response.isSuccess && response.data) {
          const data = response.data;
          const paginatedResult = new PaginatedResult<Product>({
            items: data.items.map((item: any) => new Product(item)),
            pageNumber: data.pageNumber,
            pageSize: data.pageSize,
            totalPages: data.totalPages,
            totalCount: data.totalCount,
            hasPreviousPage: data.hasPreviousPage,
            hasNextPage: data.hasNextPage
          });
          return Result.success(paginatedResult);
        }
        return Result.failure<PaginatedResult<Product>>(response.error || 'Failed to fetch products');
      })
    );
  }

  create(product: Product): Observable<Result<string>> {
    return this.http.post<Result<string>>(`${this.baseUrl}`, product);
  }

  update(id: string, product: Product): Observable<Result<void>> {
    return this.http.put<Result<void>>(`${this.baseUrl}/${id}`, product);
  }

  delete(id: string): Observable<Result<void>> {
    return this.http.delete<Result<void>>(`${this.baseUrl}/${id}`);
  }

  search(searchTerm: string, pageNumber = 1, pageSize = 10): Observable<Result<PaginatedResult<Product>>> {
    const params = new HttpParams()
      .set('searchTerm', searchTerm)
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<Result<any>>(`${this.baseUrl}`, { params }).pipe(
      map(response => {
        if (response.isSuccess && response.data) {
          const data = response.data;
          const paginatedResult = new PaginatedResult<Product>({
            items: data.items.map((item: any) => new Product(item)),
            pageNumber: data.pageNumber,
            pageSize: data.pageSize,
            totalPages: data.totalPages,
            totalCount: data.totalCount,
            hasPreviousPage: data.hasPreviousPage,
            hasNextPage: data.hasNextPage
          });
          return Result.success(paginatedResult);
        }
        return Result.failure<PaginatedResult<Product>>(response.error || 'Failed to search products');
      })
    );
  }

  getByCategory(categoryId: string, pageNumber = 1, pageSize = 10): Observable<Result<PaginatedResult<Product>>> {
    const params = new HttpParams()
      .set('categoryId', categoryId)
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<Result<any>>(`${this.baseUrl}`, { params }).pipe(
      map(response => {
        if (response.isSuccess && response.data) {
          const data = response.data;
          const paginatedResult = new PaginatedResult<Product>({
            items: data.items.map((item: any) => new Product(item)),
            pageNumber: data.pageNumber,
            pageSize: data.pageSize,
            totalPages: data.totalPages,
            totalCount: data.totalCount,
            hasPreviousPage: data.hasPreviousPage,
            hasNextPage: data.hasNextPage
          });
          return Result.success(paginatedResult);
        }
        return Result.failure<PaginatedResult<Product>>(response.error || 'Failed to fetch products by category');
      })
    );
  }
}
