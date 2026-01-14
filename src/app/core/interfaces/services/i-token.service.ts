import { InjectionToken } from '@angular/core';
import { TokenPayload } from '@core';

/**
 * Token service interface
 * Abstraction for JWT token management
 */
export interface ITokenService {
  getToken(): string | null;
  setToken(token: string): void;
  removeToken(): void;
  isTokenExpired(): boolean;
  getTokenPayload(): TokenPayload | null;
}

/**
 * Injection token for ITokenService
 */
export const ITokenService = new InjectionToken<ITokenService>('ITokenService');
