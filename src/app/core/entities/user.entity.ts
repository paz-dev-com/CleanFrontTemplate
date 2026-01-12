import { BaseEntity } from './base.entity';

/**
 * User domain entity
 * Matches backend User entity
 */
export class User extends BaseEntity {
  username: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  isActive: boolean;
  roles: string[];

  constructor(data?: Partial<User>) {
    super(data);
    this.username = data?.username || '';
    this.email = data?.email || '';
    this.firstName = data?.firstName || null;
    this.lastName = data?.lastName || null;
    this.isActive = data?.isActive ?? true;
    this.roles = data?.roles || [];
  }

  get fullName(): string {
    if (this.firstName && this.lastName) {
      return `${this.firstName} ${this.lastName}`;
    }
    return this.username;
  }

  hasRole(role: string): boolean {
    return this.roles.includes(role);
  }

  isAdmin(): boolean {
    return this.hasRole('Admin');
  }
}
