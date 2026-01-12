/**
 * Update Product Command
 */
export interface UpdateProductCommand {
  id: string;
  name: string;
  description: string | null;
  price: number;
  sku: string;
  categoryId: string | null;
  stockQuantity: number;
  isActive: boolean;
}
