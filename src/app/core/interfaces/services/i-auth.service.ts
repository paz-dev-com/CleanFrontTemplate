import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../entities/user.entity';
import { Result } from '../../models/result.model';

/**
 * Authentication service interface
 * Abstraction for auth operations
 */
export interface IAuthService {
  login(username: string, password: string): Observable<Result<{ token: string; user: User }>>;
  logout(): void;
  isAuthenticated(): boolean;
  getCurrentUser(): User | null;
}

/**
 * Injection token for IAuthService
 */
export const IAuthService = new InjectionToken<IAuthService>('IAuthService');
