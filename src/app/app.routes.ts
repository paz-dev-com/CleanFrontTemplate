import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { UserRole } from './core';
import { authGuard, roleGuard } from './shared/guards';

// Placeholder component - create this later
@Component({
  selector: 'app-unauthorized',
  standalone: true,
  template: '<h1>Unauthorized Access</h1><p>You do not have permission to view this page.</p>'
})
class UnauthorizedComponent {}

/**
 * Application routes with Clean Architecture structure
 * Features are lazy-loaded for better performance
 */
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
  {
    path: 'products',
    loadChildren: () => import('./features/products/products.routes').then(m => m.PRODUCT_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/products/products.routes').then(m => m.PRODUCT_ROUTES),
    canActivate: [roleGuard([UserRole.Admin])]
  },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent
  },
  {
    path: '**',
    redirectTo: 'products' 
  }
];
