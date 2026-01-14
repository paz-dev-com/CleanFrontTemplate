import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { TokenService } from './token.service';

describe('TokenService', () => {
  let service: TokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TokenService],
    });
    service = TestBed.inject(TokenService);
    localStorage.clear();
  });

  describe('getToken', () => {
    it('should return null when no token is stored', () => {
      expect(service.getToken()).toBeNull();
    });

    it('should return stored token', () => {
      localStorage.setItem('auth_token', 'test-token');
      expect(service.getToken()).toBe('test-token');
    });
  });

  describe('setToken', () => {
    it('should store token in localStorage', () => {
      service.setToken('new-token');
      expect(localStorage.getItem('auth_token')).toBe('new-token');
    });

    it('should overwrite existing token', () => {
      service.setToken('first-token');
      service.setToken('second-token');
      expect(service.getToken()).toBe('second-token');
    });
  });

  describe('removeToken', () => {
    it('should remove token from localStorage', () => {
      service.setToken('test-token');
      service.removeToken();
      expect(service.getToken()).toBeNull();
    });

    it('should not throw error when removing non-existent token', () => {
      expect(() => service.removeToken()).not.toThrow();
    });
  });

  describe('isTokenExpired', () => {
    it('should return true when no token exists', () => {
      expect(service.isTokenExpired()).toBe(true);
    });

    it('should return true for expired token', () => {
      // Create token with past expiration
      const pastTimestamp = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const payload = btoa(JSON.stringify({ exp: pastTimestamp, sub: 'user123' }));
      const signature = 'signature';
      const expiredToken = `${header}.${payload}.${signature}`;

      service.setToken(expiredToken);
      expect(service.isTokenExpired()).toBe(true);
    });

    it('should return false for valid token', () => {
      // Create token with future expiration
      const futureTimestamp = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const payload = btoa(JSON.stringify({ exp: futureTimestamp, sub: 'user123' }));
      const signature = 'signature';
      const validToken = `${header}.${payload}.${signature}`;

      service.setToken(validToken);
      expect(service.isTokenExpired()).toBe(false);
    });

    it('should return true for malformed token', () => {
      service.setToken('invalid-token');
      expect(service.isTokenExpired()).toBe(true);
    });

    it('should return true for token without exp claim', () => {
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const payload = btoa(JSON.stringify({ sub: 'user123' })); // No exp
      const signature = 'signature';
      const tokenWithoutExp = `${header}.${payload}.${signature}`;

      service.setToken(tokenWithoutExp);
      expect(service.isTokenExpired()).toBe(true);
    });
  });

  describe('getTokenPayload', () => {
    it('should return null when no token exists', () => {
      expect(service.getTokenPayload()).toBeNull();
    });

    it('should decode and return token payload', () => {
      const payload = { sub: 'user123', role: 'Admin', exp: 1234567890 };
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const encodedPayload = btoa(JSON.stringify(payload));
      const signature = 'signature';
      const token = `${header}.${encodedPayload}.${signature}`;

      service.setToken(token);
      const decodedPayload = service.getTokenPayload();

      expect(decodedPayload).toBeDefined();
      if (decodedPayload) {
        expect(decodedPayload.sub).toBe('user123');
        expect(decodedPayload.role).toBe('Admin');
        expect(decodedPayload.exp).toBe(1234567890);
      }
    });

    it('should return null for malformed token', () => {
      service.setToken('invalid-token');
      expect(service.getTokenPayload()).toBeNull();
    });

    it('should return null for token with invalid JSON in payload', () => {
      const header = btoa(JSON.stringify({ alg: 'HS256' }));
      const invalidPayload = btoa('not-json{invalid}');
      const signature = 'signature';
      const token = `${header}.${invalidPayload}.${signature}`;

      service.setToken(token);
      expect(service.getTokenPayload()).toBeNull();
    });

    it('should handle URL-safe base64 encoding', () => {
      // Create payload with characters that need URL-safe encoding
      const payload = { sub: 'user+123/test==' };
      const header = btoa(JSON.stringify({ alg: 'HS256' }));
      const base64Payload = btoa(JSON.stringify(payload));
      // Convert to URL-safe base64
      const urlSafePayload = base64Payload.replace(/\+/g, '-').replace(/\//g, '_');
      const signature = 'signature';
      const token = `${header}.${urlSafePayload}.${signature}`;

      service.setToken(token);
      const decodedPayload = service.getTokenPayload();

      expect(decodedPayload).toBeDefined();
      if (decodedPayload) expect(decodedPayload.sub).toBe('user+123/test==');
    });
  });
});
