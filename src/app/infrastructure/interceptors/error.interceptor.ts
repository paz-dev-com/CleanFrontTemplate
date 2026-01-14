import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

/**
 * Error Interceptor
 * Handles HTTP errors globally
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An error occurred';

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Client Error: ${error.error.message}`;
        console.error('Client-side error:', error.error.message);
      } else {
        // Server-side error
        console.error('Server-side error:', {
          status: error.status,
          statusText: error.statusText,
          url: error.url,
          error: error.error,
        });

        switch (error.status) {
          case 0:
            errorMessage =
              'Cannot connect to server. Check if the API is running and CORS is configured.';
            console.error(
              'Network error - possible causes: API not running, CORS issue, or SSL certificate problem'
            );
            break;
          case 401:
            errorMessage = 'Unauthorized - Please login';
            router.navigate(['/auth/login']);
            break;
          case 403:
            errorMessage = 'Forbidden - Access denied';
            break;
          case 404:
            errorMessage = 'Resource not found';
            break;
          case 500:
            errorMessage = 'Internal server error';
            break;
          default:
            errorMessage = error.error?.error || error.message || 'Unknown error occurred';
        }
      }

      console.error('HTTP Error:', errorMessage, error);
      return throwError(() => new Error(errorMessage));
    })
  );
};
