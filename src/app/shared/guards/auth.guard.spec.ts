/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from '@features/auth';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    const authServiceMock = {
      isAuthenticated: vi.fn(),
    };

    const routerMock = {
      navigate: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('should allow access when user is authenticated', () => {
    vi.spyOn(authService, 'isAuthenticated').mockReturnValue(true);

    const route: any = {};
    const state: any = { url: '/products' };

    const result = TestBed.runInInjectionContext(() => authGuard(route, state));

    expect(result).toBe(true);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should deny access when user is not authenticated', () => {
    vi.spyOn(authService, 'isAuthenticated').mockReturnValue(false);

    const route: any = {};
    const state: any = { url: '/products' };

    const result = TestBed.runInInjectionContext(() => authGuard(route, state));

    expect(result).toBe(false);
  });

  it('should redirect to login when user is not authenticated', () => {
    vi.spyOn(authService, 'isAuthenticated').mockReturnValue(false);
    const navigateSpy = vi.spyOn(router, 'navigate');

    const route: any = {};
    const state: any = { url: '/products' };

    TestBed.runInInjectionContext(() => authGuard(route, state));

    expect(navigateSpy).toHaveBeenCalledWith(['/auth/login'], {
      queryParams: { returnUrl: '/products' },
    });
  });

  it('should include returnUrl in query params', () => {
    vi.spyOn(authService, 'isAuthenticated').mockReturnValue(false);
    const navigateSpy = vi.spyOn(router, 'navigate');

    const route: any = {};
    const state: any = { url: '/products/123' };

    TestBed.runInInjectionContext(() => authGuard(route, state));

    expect(navigateSpy).toHaveBeenCalledWith(['/auth/login'], {
      queryParams: { returnUrl: '/products/123' },
    });
  });

  it('should handle root path', () => {
    vi.spyOn(authService, 'isAuthenticated').mockReturnValue(false);
    const navigateSpy = vi.spyOn(router, 'navigate');

    const route: any = {};
    const state: any = { url: '/' };

    TestBed.runInInjectionContext(() => authGuard(route, state));

    expect(navigateSpy).toHaveBeenCalledWith(['/auth/login'], {
      queryParams: { returnUrl: '/' },
    });
  });
});
