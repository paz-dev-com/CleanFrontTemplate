import { Injectable } from '@angular/core';
import { IStorageService } from '../../core';

/**
 * Storage Service Implementation
 * Abstracts localStorage operations
 */
@Injectable({
  providedIn: 'root'
})
export class StorageService implements IStorageService {
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  }

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage', error);
    }
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }

  clear(): void {
    localStorage.clear();
  }
}
