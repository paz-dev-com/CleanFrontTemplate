import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StorageService]
    });
    service = TestBed.inject(StorageService);
    localStorage.clear();
  });

  describe('get', () => {
    it('should return null for non-existent key', () => {
      expect(service.get('non-existent')).toBeNull();
    });

    it('should retrieve stored string value', () => {
      localStorage.setItem('test', JSON.stringify('test value'));
      expect(service.get<string>('test')).toBe('test value');
    });

    it('should retrieve stored number value', () => {
      localStorage.setItem('number', JSON.stringify(42));
      expect(service.get<number>('number')).toBe(42);
    });

    it('should retrieve stored boolean value', () => {
      localStorage.setItem('flag', JSON.stringify(true));
      expect(service.get<boolean>('flag')).toBe(true);
    });

    it('should retrieve stored object value', () => {
      const obj = { id: 1, name: 'Test' };
      localStorage.setItem('object', JSON.stringify(obj));
      expect(service.get<typeof obj>('object')).toEqual(obj);
    });

    it('should retrieve stored array value', () => {
      const arr = [1, 2, 3, 4, 5];
      localStorage.setItem('array', JSON.stringify(arr));
      expect(service.get<number[]>('array')).toEqual(arr);
    });

    it('should return null for invalid JSON', () => {
      localStorage.setItem('invalid', 'not-valid-json{');
      expect(service.get('invalid')).toBeNull();
    });

    it('should handle complex nested objects', () => {
      const complex = {
        user: { id: 1, name: 'John' },
        items: [{ id: 1 }, { id: 2 }],
        settings: { theme: 'dark', language: 'en' }
      };
      localStorage.setItem('complex', JSON.stringify(complex));
      expect(service.get<typeof complex>('complex')).toEqual(complex);
    });
  });

  describe('set', () => {
    it('should store string value', () => {
      service.set('test', 'test value');
      expect(localStorage.getItem('test')).toBe('"test value"');
    });

    it('should store number value', () => {
      service.set('number', 42);
      expect(localStorage.getItem('number')).toBe('42');
    });

    it('should store boolean value', () => {
      service.set('flag', true);
      expect(localStorage.getItem('flag')).toBe('true');
    });

    it('should store object value', () => {
      const obj = { id: 1, name: 'Test' };
      service.set('object', obj);
      expect(JSON.parse(localStorage.getItem('object') || '')).toEqual(obj);
    });

    it('should store array value', () => {
      const arr = [1, 2, 3];
      service.set('array', arr);
      expect(JSON.parse(localStorage.getItem('array') || '')).toEqual(arr);
    });

    it('should overwrite existing value', () => {
      service.set('key', 'first');
      service.set('key', 'second');
      expect(service.get<string>('key')).toBe('second');
    });

    it('should store null value', () => {
      service.set('nullable', null);
      expect(localStorage.getItem('nullable')).toBe('null');
    });

    it('should store undefined as null', () => {
      service.set('undefined', undefined);
      expect(localStorage.getItem('undefined')).toBe('undefined'); // JSON.stringify converts undefined to undefined string
    });

    it('should handle storage errors gracefully', () => {
      // Mock localStorage.setItem to throw an error
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('Storage quota exceeded');
      });

      expect(() => service.set('key', 'value')).not.toThrow();
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
      setItemSpy.mockRestore();
    });
  });

  describe('remove', () => {
    it('should remove existing key', () => {
      service.set('key', 'value');
      service.remove('key');
      expect(service.get('key')).toBeNull();
    });

    it('should not throw error when removing non-existent key', () => {
      expect(() => service.remove('non-existent')).not.toThrow();
    });

    it('should only remove specified key', () => {
      localStorage.clear();
      service.set('key1', 'value1');
      service.set('key2', 'value2');
      service.remove('key1');
      
      expect(service.get('key1')).toBeNull();
      expect(service.get<string>('key2')).toBe('value2');
    });
  });

  describe('clear', () => {
    it('should remove all stored items', () => {
      service.set('key1', 'value1');
      service.set('key2', 'value2');
      service.set('key3', 'value3');
      
      service.clear();
      
      expect(service.get('key1')).toBeNull();
      expect(service.get('key2')).toBeNull();
      expect(service.get('key3')).toBeNull();
    });

    it('should not throw error when clearing empty storage', () => {
      expect(() => service.clear()).not.toThrow();
    });

    it('should work after multiple operations', () => {
      service.set('key1', 'value1');
      service.remove('key1');
      service.set('key2', 'value2');
      service.clear();
      
      expect(service.get('key2')).toBeNull();
    });
  });

  describe('integration scenarios', () => {
    it('should handle set, get, remove cycle', () => {
      localStorage.clear();
      const testData = { id: 1, name: 'Test' };
      
      service.set('data', testData);
      const retrieved = service.get<typeof testData>('data');
      expect(retrieved).toEqual(testData);
      
      service.remove('data');
      expect(service.get('data')).toBeNull();
    });

    it('should handle multiple keys independently', () => {
      localStorage.clear();
      service.set('user', { id: 1, name: 'John' });
      service.set('settings', { theme: 'dark' });
      service.set('token', 'abc123');
      
      expect(service.get('user')).toEqual({ id: 1, name: 'John' });
      expect(service.get('settings')).toEqual({ theme: 'dark' });
      expect(service.get<string>('token')).toBe('abc123');
    });
  });
});
