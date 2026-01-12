import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../features/auth';
import { HasRoleDirective } from '../../directives';

/**
 * Header Component
 * Navigation bar with user menu
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, HasRoleDirective],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  getCurrentUserName(): string {
    const user = this.authService.getCurrentUser();
    return user?.fullName || user?.username || 'User';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
