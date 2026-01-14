/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Result, User } from '@core';
import { AuthService } from '@features/auth';
import { of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    const authServiceMock = {
      login: vi.fn(),
    };

    const routerMock = {
      navigate: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        LoginComponent,
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    component = TestBed.inject(LoginComponent);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);

    // Clear session storage before each test
    sessionStorage.clear();
  });

  describe('initialization', () => {
    it('should create', () => {
      expect(component).toBeDefined();
    });

    it('should initialize with empty credentials', () => {
      expect(component.username).toBe('');
      expect(component.password).toBe('');
    });

    it('should initialize with loading false', () => {
      expect(component.loading).toBe(false);
    });

    it('should initialize with no error', () => {
      expect(component.error).toBeNull();
    });
  });

  describe('onSubmit', () => {
    it('should not call login service when username is empty', () => {
      component.username = '';
      component.password = 'password';

      component.onSubmit();

      expect(authService.login).not.toHaveBeenCalled();
    });

    it('should not call login service when password is empty', () => {
      component.username = 'user';
      component.password = '';

      component.onSubmit();

      expect(authService.login).not.toHaveBeenCalled();
    });

    it('should not call login service when both fields are empty', () => {
      component.username = '';
      component.password = '';

      component.onSubmit();

      expect(authService.login).not.toHaveBeenCalled();
    });

    it('should set loading to true when submitting', () => {
      component.username = 'user';
      component.password = 'password';

      let subscriptionCalled = false;
      const mockResponse = {
        token: 'test-token',
        user: new User({ id: '1', username: 'user', email: 'user@test.com', roles: ['User'] }),
      };
      vi.spyOn(authService, 'login').mockReturnValue({
        subscribe: (observer: any) => {
          // Check loading state before calling observer
          expect(component.loading).toBe(true);
          subscriptionCalled = true;
          observer.next(Result.success(mockResponse));
          return {
            unsubscribe: () => {
              /* no-op */
            },
          };
        },
      } as any);

      component.onSubmit();

      expect(subscriptionCalled).toBe(true);
    });

    it('should clear error when submitting', () => {
      component.username = 'user';
      component.password = 'password';
      component.error = 'Previous error';

      const mockResponse = {
        token: 'test-token',
        user: new User({ id: '1', username: 'user', email: 'user@test.com', roles: ['User'] }),
      };
      vi.spyOn(authService, 'login').mockReturnValue(of(Result.success(mockResponse)));

      component.onSubmit();

      expect(component.error).toBeNull();
    });

    it('should call login service with credentials', () => {
      component.username = 'testuser';
      component.password = 'testpass';

      const mockResponse = {
        token: 'test-token',
        user: new User({ id: '1', username: 'testuser', email: 'user@test.com', roles: ['User'] }),
      };
      vi.spyOn(authService, 'login').mockReturnValue(of(Result.success(mockResponse)));

      component.onSubmit();

      expect(authService.login).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'testpass',
      });
    });

    it('should navigate to /products on successful login', () => {
      component.username = 'user';
      component.password = 'password';

      const mockResponse = {
        token: 'test-token',
        user: new User({ id: '1', username: 'user', email: 'user@test.com', roles: ['User'] }),
      };
      const navigateSpy = vi.spyOn(router, 'navigate');
      vi.spyOn(authService, 'login').mockReturnValue(of(Result.success(mockResponse)));

      component.onSubmit();

      expect(navigateSpy).toHaveBeenCalledWith(['/products']);
      expect(component.loading).toBe(false);
    });

    it('should navigate to returnUrl if present in sessionStorage', () => {
      sessionStorage.setItem('returnUrl', '/products/123');
      component.username = 'user';
      component.password = 'password';

      const mockResponse = {
        token: 'test-token',
        user: new User({ id: '1', username: 'user', email: 'user@test.com', roles: ['User'] }),
      };
      const navigateSpy = vi.spyOn(router, 'navigate');
      vi.spyOn(authService, 'login').mockReturnValue(of(Result.success(mockResponse)));

      component.onSubmit();

      expect(navigateSpy).toHaveBeenCalledWith(['/products/123']);
    });

    it('should remove returnUrl from sessionStorage after navigation', () => {
      sessionStorage.setItem('returnUrl', '/products/123');
      component.username = 'user';
      component.password = 'password';

      const mockResponse = {
        token: 'test-token',
        user: new User({ id: '1', username: 'user', email: 'user@test.com', roles: ['User'] }),
      };
      vi.spyOn(authService, 'login').mockReturnValue(of(Result.success(mockResponse)));

      component.onSubmit();

      expect(sessionStorage.getItem('returnUrl')).toBeNull();
    });

    it('should set error message on failed login', () => {
      component.username = 'user';
      component.password = 'wrongpassword';

      vi.spyOn(authService, 'login').mockReturnValue(
        of(Result.failure<{ token: string; user: User }>('Invalid credentials'))
      );

      component.onSubmit();

      expect(component.error).toBe('Invalid credentials');
      expect(component.loading).toBe(false);
    });

    it('should set default error message when no error provided', () => {
      component.username = 'user';
      component.password = 'wrongpassword';

      vi.spyOn(authService, 'login').mockReturnValue(
        of(Result.failure<{ token: string; user: User }>(null as any))
      );

      component.onSubmit();

      expect(component.error).toBe('Login failed');
      expect(component.loading).toBe(false);
    });

    it('should handle service error', () => {
      component.username = 'user';
      component.password = 'password';

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {
        /* no-op */
      });
      vi.spyOn(authService, 'login').mockReturnValue(throwError(() => new Error('Network error')));

      component.onSubmit();

      expect(component.error).toBe('An error occurred during login');
      expect(component.loading).toBe(false);
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it('should set loading to false after error', () => {
      component.username = 'user';
      component.password = 'password';

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {
        // no-op
      });

      vi.spyOn(authService, 'login').mockReturnValue(throwError(() => new Error('Error')));

      component.onSubmit();

      expect(component.loading).toBe(false);

      consoleErrorSpy.mockRestore();
    });

    it('should not navigate on failed login', () => {
      component.username = 'user';
      component.password = 'wrongpassword';

      const navigateSpy = vi.spyOn(router, 'navigate');
      vi.spyOn(authService, 'login').mockReturnValue(
        of(Result.failure<{ token: string; user: User }>('Invalid credentials'))
      );

      component.onSubmit();

      expect(navigateSpy).not.toHaveBeenCalled();
    });

    it('should handle whitespace-only username', () => {
      component.username = '   ';
      component.password = 'password';

      // Since the component checks for falsy, whitespace should pass
      // but in reality, backend would reject it
      const mockResponse = {
        token: 'test-token',
        user: new User({ id: '1', username: '   ', email: 'user@test.com', roles: ['User'] }),
      };
      vi.spyOn(authService, 'login').mockReturnValue(of(Result.success(mockResponse)));

      component.onSubmit();

      expect(authService.login).toHaveBeenCalledWith({
        username: '   ',
        password: 'password',
      });
    });
  });
});
