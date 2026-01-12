/**
 * Paginated result matching backend PaginatedResult<T>
 */
export class PaginatedResult<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;

  constructor(data?: Partial<PaginatedResult<T>>) {
    this.items = data?.items || [];
    this.pageNumber = data?.pageNumber || 1;
    this.pageSize = data?.pageSize || 10;
    this.totalPages = data?.totalPages || 0;
    this.totalCount = data?.totalCount || 0;
    this.hasPreviousPage = data?.hasPreviousPage || false;
    this.hasNextPage = data?.hasNextPage || false;
  }
}
