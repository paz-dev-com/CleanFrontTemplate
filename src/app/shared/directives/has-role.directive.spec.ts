/* eslint-disable @typescript-eslint/no-explicit-any */
import { TemplateRef, ViewContainerRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { User } from '@core';
import { AuthService } from '@features/auth';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HasRoleDirective } from './has-role.directive';

describe('HasRoleDirective', () => {
  let directive: HasRoleDirective;
  let authService: AuthService;
  let templateRef: TemplateRef<any>;
  let viewContainer: ViewContainerRef;

  beforeEach(() => {
    const authServiceMock = {
      getCurrentUser: vi.fn(),
    };

    const templateRefMock = {} as TemplateRef<any>;
    const viewContainerMock = {
      createEmbeddedView: vi.fn(),
      clear: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        HasRoleDirective,
        { provide: AuthService, useValue: authServiceMock },
        { provide: TemplateRef, useValue: templateRefMock },
        { provide: ViewContainerRef, useValue: viewContainerMock },
      ],
    });

    directive = TestBed.inject(HasRoleDirective);
    authService = TestBed.inject(AuthService);
    templateRef = TestBed.inject(TemplateRef);
    viewContainer = TestBed.inject(ViewContainerRef);
  });

  it('should create', () => {
    expect(directive).toBeDefined();
  });

  it('should show content when user has required role', () => {
    const mockUser = new User({
      id: '1',
      username: 'admin',
      email: 'admin@test.com',
      roles: ['Admin'],
    });

    vi.spyOn(authService, 'getCurrentUser').mockReturnValue(mockUser);
    const createViewSpy = vi.spyOn(viewContainer, 'createEmbeddedView');
    const clearSpy = vi.spyOn(viewContainer, 'clear');

    directive.appHasRole = 'Admin';

    expect(createViewSpy).toHaveBeenCalledWith(templateRef);
    expect(clearSpy).not.toHaveBeenCalled();
  });

  it('should hide content when user does not have required role', () => {
    const mockUser = new User({
      id: '1',
      username: 'user',
      email: 'user@test.com',
      roles: ['User'],
    });

    vi.spyOn(authService, 'getCurrentUser').mockReturnValue(mockUser);
    const createViewSpy = vi.spyOn(viewContainer, 'createEmbeddedView');
    const clearSpy = vi.spyOn(viewContainer, 'clear');

    directive.appHasRole = 'Admin';

    expect(clearSpy).toHaveBeenCalled();
    expect(createViewSpy).not.toHaveBeenCalled();
  });

  it('should hide content when user is null', () => {
    vi.spyOn(authService, 'getCurrentUser').mockReturnValue(null);
    const createViewSpy = vi.spyOn(viewContainer, 'createEmbeddedView');
    const clearSpy = vi.spyOn(viewContainer, 'clear');

    directive.appHasRole = 'Admin';

    expect(clearSpy).toHaveBeenCalled();
    expect(createViewSpy).not.toHaveBeenCalled();
  });

  it('should hide content when user is undefined', () => {
    vi.spyOn(authService, 'getCurrentUser').mockReturnValue(undefined as any);
    const createViewSpy = vi.spyOn(viewContainer, 'createEmbeddedView');
    const clearSpy = vi.spyOn(viewContainer, 'clear');

    directive.appHasRole = 'Admin';

    expect(clearSpy).toHaveBeenCalled();
    expect(createViewSpy).not.toHaveBeenCalled();
  });

  it('should handle role check case-sensitively', () => {
    const mockUser = new User({
      id: '1',
      username: 'admin',
      email: 'admin@test.com',
      roles: ['Admin'],
    });

    vi.spyOn(authService, 'getCurrentUser').mockReturnValue(mockUser);
    const createViewSpy = vi.spyOn(viewContainer, 'createEmbeddedView');
    const clearSpy = vi.spyOn(viewContainer, 'clear');

    directive.appHasRole = 'admin'; // lowercase

    expect(clearSpy).toHaveBeenCalled();
    expect(createViewSpy).not.toHaveBeenCalled();
  });

  it('should update view when role changes', () => {
    const mockUser = new User({
      id: '1',
      username: 'admin',
      email: 'admin@test.com',
      roles: ['Admin'],
    });

    vi.spyOn(authService, 'getCurrentUser').mockReturnValue(mockUser);
    const createViewSpy = vi.spyOn(viewContainer, 'createEmbeddedView');
    const clearSpy = vi.spyOn(viewContainer, 'clear');

    // First set role that user has
    directive.appHasRole = 'Admin';
    expect(createViewSpy).toHaveBeenCalledTimes(1);

    // Then set role that user doesn't have
    directive.appHasRole = 'SuperAdmin';
    expect(clearSpy).toHaveBeenCalledTimes(1);
  });

  it('should work with User role', () => {
    const mockUser = new User({
      id: '1',
      username: 'user',
      email: 'user@test.com',
      roles: ['User'],
    });

    vi.spyOn(authService, 'getCurrentUser').mockReturnValue(mockUser);
    const createViewSpy = vi.spyOn(viewContainer, 'createEmbeddedView');

    directive.appHasRole = 'User';

    expect(createViewSpy).toHaveBeenCalledWith(templateRef);
  });
});
