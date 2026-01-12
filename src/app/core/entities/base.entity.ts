/**
 * Base entity with common properties
 * Pure TypeScript - Zero dependencies
 */
export abstract class BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;

  constructor(data?: Partial<BaseEntity>) {
    this.id = data?.id || '';
    this.createdAt = data?.createdAt || new Date();
    this.updatedAt = data?.updatedAt || new Date();
    this.isDeleted = data?.isDeleted || false;
  }
}
