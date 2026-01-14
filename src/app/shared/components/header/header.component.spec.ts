/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { User } from '@core';
import { AuthService } from '@features/auth';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    const authServiceMock = {
      isAuthenticated: vi.fn(),
      getCurrentUser: vi.fn(),
      logout: vi.fn(),
    };

    const routerMock = {
      navigate: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        HeaderComponent,
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    component = TestBed.inject(HeaderComponent);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  describe('initialization', () => {
    it('should create', () => {
      expect(component).toBeDefined();
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when user is authenticated', () => {
      vi.spyOn(authService, 'isAuthenticated').mockReturnValue(true);

      expect(component.isAuthenticated()).toBe(true);
    });

    it('should return false when user is not authenticated', () => {
      vi.spyOn(authService, 'isAuthenticated').mockReturnValue(false);

      expect(component.isAuthenticated()).toBe(false);
    });
  });

  describe('getCurrentUserName', () => {
    it('should return full name when available', () => {
      const user = new User({
        id: '1',
        username: 'johndoe',
        email: 'john@test.com',
        firstName: 'John',
        lastName: 'Doe',
        roles: ['User'],
      });

      vi.spyOn(authService, 'getCurrentUser').mockReturnValue(user);

      expect(component.getCurrentUserName()).toBe('John Doe');
    });

    it('should return username when full name is not available', () => {
      const user = new User({
        id: '1',
        username: 'johndoe',
        email: 'john@test.com',
        roles: ['User'],
      });

      vi.spyOn(authService, 'getCurrentUser').mockReturnValue(user);

      expect(component.getCurrentUserName()).toBe('johndoe');
    });

    it('should return "User" when no user is available', () => {
      vi.spyOn(authService, 'getCurrentUser').mockReturnValue(null);

      expect(component.getCurrentUserName()).toBe('User');
    });

    it('should return "User" when user is undefined', () => {
      vi.spyOn(authService, 'getCurrentUser').mockReturnValue(undefined as any);

      expect(component.getCurrentUserName()).toBe('User');
    });

    it('should prefer full name over username', () => {
      const user = new User({
        id: '1',
        username: 'jdoe',
        email: 'john@test.com',
        firstName: 'John',
        lastName: 'Doe',
        roles: ['User'],
      });

      vi.spyOn(authService, 'getCurrentUser').mockReturnValue(user);

      const name = component.getCurrentUserName();
      expect(name).toBe('John Doe');
      expect(name).not.toBe('jdoe');
    });
  });

  describe('logout', () => {
    it('should call authService.logout', () => {
      const logoutSpy = vi.spyOn(authService, 'logout');

      component.logout();

      expect(logoutSpy).toHaveBeenCalled();
    });

    it('should navigate to login page', () => {
      const navigateSpy = vi.spyOn(router, 'navigate');

      component.logout();

      expect(navigateSpy).toHaveBeenCalledWith(['/auth/login']);
    });

    it('should logout before navigating', () => {
      const logoutSpy = vi.spyOn(authService, 'logout');
      const navigateSpy = vi.spyOn(router, 'navigate');

      component.logout();

      expect(logoutSpy).toHaveBeenCalled();
      expect(navigateSpy).toHaveBeenCalled();
    });
  });
});
