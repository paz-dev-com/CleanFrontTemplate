import { BaseEntity } from './base.entity';

/**
 * Category domain entity
 * Matches backend Category entity
 */
export class Category extends BaseEntity {
  name: string;
  description: string | null;
  isActive: boolean;

  constructor(data?: Partial<Category>) {
    super(data);
    this.name = data?.name || '';
    this.description = data?.description || null;
    this.isActive = data?.isActive ?? true;
  }

  isValid(): boolean {
    return this.name.length > 0;
  }
}
