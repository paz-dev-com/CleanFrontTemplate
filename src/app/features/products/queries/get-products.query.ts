/**
 * Get Products Query (CQRS Pattern)
 * Represents a read operation
 */
export interface GetProductsQuery {
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
  categoryId?: string;
}
