import { Injectable, inject } from '@angular/core';
import { IAuthService, Result, User } from '@core';
import { LoginCommand } from '@features/auth';
import { Observable } from 'rxjs';

/**
 * Auth Service (Use Case Handler)
 * Orchestrates authentication business logic
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly authService = inject(IAuthService);

  login(command: LoginCommand): Observable<Result<{ token: string; user: User }>> {
    return this.authService.login(command.username, command.password);
  }

  logout(): void {
    this.authService.logout();
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  getCurrentUser(): User | null {
    return this.authService.getCurrentUser();
  }
}
