import { Component } from '@angular/core';

/**
 * Loading Spinner Component
 * Reusable loading indicator
 */
@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [],
  template: `
    <div class="spinner-container">
      <div class="spinner"></div>
      @if (message) {
        <p>{{ message }}</p>
      }
    </div>
  `,
  styles: [
    `
      .spinner-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 2rem;
      }

      .spinner {
        border: 4px solid #f3f3f3;
        border-top: 4px solid #3498db;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      p {
        margin-top: 1rem;
        color: #7f8c8d;
      }
    `,
  ],
})
export class LoadingSpinnerComponent {
  message = '';
}
