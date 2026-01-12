import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Category, ICategoryRepository, PaginatedResult, Result } from '../../core';

/**
 * Category HTTP Repository
 */
@Injectable({
  providedIn: 'root'
})
export class CategoryHttpRepository implements ICategoryRepository {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/categories`;

  getById(id: string): Observable<Result<Category>> {
    return this.http.get<Result<any>>(`${this.baseUrl}/${id}`).pipe(
      map(response => {
        if (response.isSuccess && response.data) {
          return Result.success(new Category(response.data));
        }
        return Result.failure<Category>(response.error || 'Failed to fetch category');
      })
    );
  }

  getAll(pageNumber = 1, pageSize = 10): Observable<Result<PaginatedResult<Category>>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<Result<any>>(`${this.baseUrl}`, { params }).pipe(
      map(response => {
        if (response.isSuccess && response.data) {
          const data = response.data;
          const paginatedResult = new PaginatedResult<Category>({
            items: data.items.map((item: any) => new Category(item)),
            pageNumber: data.pageNumber,
            pageSize: data.pageSize,
            totalPages: data.totalPages,
            totalCount: data.totalCount,
            hasPreviousPage: data.hasPreviousPage,
            hasNextPage: data.hasNextPage
          });
          return Result.success(paginatedResult);
        }
        return Result.failure<PaginatedResult<Category>>(response.error || 'Failed to fetch categories');
      })
    );
  }

  create(category: Category): Observable<Result<string>> {
    return this.http.post<Result<string>>(`${this.baseUrl}`, category);
  }

  update(id: string, category: Category): Observable<Result<void>> {
    return this.http.put<Result<void>>(`${this.baseUrl}/${id}`, category);
  }

  delete(id: string): Observable<Result<void>> {
    return this.http.delete<Result<void>>(`${this.baseUrl}/${id}`);
  }
}
