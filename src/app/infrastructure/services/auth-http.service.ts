import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { IAuthService, Result, User } from '../../core';
import { TokenService } from './token.service';

/**
 * Auth Service Implementation
 * Handles authentication with backend API
 */
@Injectable({
  providedIn: 'root'
})
export class AuthHttpService implements IAuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenService = inject(TokenService);
  private readonly baseUrl = `${environment.apiUrl}/auth`;

  private currentUser: User | null = null;

  login(username: string, password: string): Observable<Result<{ token: string; user: User }>> {
    const loginUrl = `${this.baseUrl}/login`;
    console.log('🔐 Attempting login to:', loginUrl);
    console.log('📡 API Base URL:', environment.apiUrl);
    console.log('👤 Username:', username);
    
    return this.http.post<Result<any>>(loginUrl, { username, password }).pipe(
      tap(response => {
        console.log('✅ Login response received:', response);
        if (response.isSuccess && response.data) {
          this.tokenService.setToken(response.data.token);
          this.currentUser = new User(response.data.user);
          console.log('🎫 Token saved, user authenticated:', this.currentUser);
        }
      }),
      map(response => {
        if (response.isSuccess && response.data) {
          return Result.success({
            token: response.data.token,
            user: new User(response.data.user)
          });
        }
        console.error('❌ Login failed:', response.error);
        return Result.failure(response.error || 'Login failed');
      })
    );
  }

  logout(): void {
    this.tokenService.removeToken();
    this.currentUser = null;
  }

  isAuthenticated(): boolean {
    return !this.tokenService.isTokenExpired();
  }

  getCurrentUser(): User | null {
    if (this.currentUser) {
      return this.currentUser;
    }

    // Try to extract user from token
    const payload = this.tokenService.getTokenPayload();
    if (payload) {
      this.currentUser = new User({
        id: payload.sub || payload.userId,
        username: payload.username,
        email: payload.email,
        roles: payload.roles || []
      });
    }

    return this.currentUser;
  }
}
