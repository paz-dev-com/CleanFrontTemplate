import { InjectionToken } from '@angular/core';

/**
 * Token service interface
 * Abstraction for JWT token management
 */
export interface ITokenService {
  getToken(): string | null;
  setToken(token: string): void;
  removeToken(): void;
  isTokenExpired(): boolean;
  getTokenPayload(): any;
}

/**
 * Injection token for ITokenService
 */
export const ITokenService = new InjectionToken<ITokenService>('ITokenService');
