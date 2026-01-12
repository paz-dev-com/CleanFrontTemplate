/**
 * Create Product Command (CQRS Pattern)
 * Represents a state-changing operation
 */
export interface CreateProductCommand {
  name: string;
  description: string | null;
  price: number;
  sku: string;
  categoryId: string | null;
  stockQuantity: number;
}
