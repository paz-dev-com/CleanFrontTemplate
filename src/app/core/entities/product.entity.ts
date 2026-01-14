import { BaseEntity } from './base.entity';

/**
 * Product domain entity
 * Matches backend Product entity
 */
export class Product extends BaseEntity {
  name: string;
  description: string | null;
  price: number;
  sku: string;
  categoryId: string | null;
  isActive: boolean;
  stockQuantity: number;

  constructor(data?: Partial<Product>) {
    super(data);
    this.name = data?.name || '';
    this.description = data?.description || null;
    this.price = data?.price || 0;
    this.sku = data?.sku || '';
    this.categoryId = data?.categoryId || null;
    this.isActive = data?.isActive ?? true;
    this.stockQuantity = data?.stockQuantity || 0;
  }

  /**
   * Domain validation
   */
  isValid(): boolean {
    return this.name.length > 0 && this.price > 0 && this.sku.length > 0;
  }

  /**
   * Domain business logic
   */
  isInStock(): boolean {
    return this.stockQuantity > 0 && this.isActive;
  }
}
