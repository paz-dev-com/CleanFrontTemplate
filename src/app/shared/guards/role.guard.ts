import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@features/auth';

/**
 * Role Guard Factory
 * Protects routes requiring specific roles
 */
export function roleGuard(allowedRoles: string[]): CanActivateFn {
  return (_route, _state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isAuthenticated()) {
      router.navigate(['/auth/login']);
      return false;
    }

    const user = authService.getCurrentUser();
    if (!user) {
      router.navigate(['/auth/login']);
      return false;
    }

    const hasRole = allowedRoles.some((role) => user.hasRole(role));
    if (!hasRole) {
      router.navigate(['/unauthorized']);
      return false;
    }

    return true;
  };
}
