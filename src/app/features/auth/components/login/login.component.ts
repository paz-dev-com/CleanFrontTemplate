import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@features/auth';

/**
 * Login Component
 * Handles user authentication
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  username = '';
  password = '';
  loading = false;
  error: string | null = null;

  onSubmit(): void {
    if (!this.username || !this.password) {
      return;
    }

    this.loading = true;
    this.error = null;

    this.authService
      .login({
        username: this.username,
        password: this.password,
      })
      .subscribe({
        next: (result) => {
          this.loading = false;
          if (result.isSuccess) {
            // Redirect to products or return URL
            const returnUrl = sessionStorage.getItem('returnUrl') || '/products';
            sessionStorage.removeItem('returnUrl');
            this.router.navigate([returnUrl]);
          } else {
            this.error = result.error || 'Login failed';
          }
        },
        error: (err) => {
          this.loading = false;
          this.error = 'An error occurred during login';
          console.error(err);
        },
      });
  }
}
