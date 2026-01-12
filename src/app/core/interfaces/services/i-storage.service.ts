import { InjectionToken } from '@angular/core';

/**
 * Storage service interface
 * Abstraction for browser storage (localStorage/sessionStorage)
 */
export interface IStorageService {
  get<T>(key: string): T | null;
  set<T>(key: string, value: T): void;
  remove(key: string): void;
  clear(): void;
}

/**
 * Injection token for IStorageService
 */
export const IStorageService = new InjectionToken<IStorageService>('IStorageService');
