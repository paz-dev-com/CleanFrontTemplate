import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

// Core interfaces
import { IAuthService, ICategoryRepository, IProductRepository, IStorageService, ITokenService } from './core';

// Infrastructure implementations
import { authInterceptor, errorInterceptor } from './infrastructure/interceptors';
import { CategoryHttpRepository, ProductHttpRepository } from './infrastructure/repositories';
import { AuthHttpService, StorageService, TokenService } from './infrastructure/services';

/**
 * Application configuration with Clean Architecture dependency injection
 * Binds Core abstractions to Infrastructure implementations
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor, errorInterceptor])
    ),

    // Repository bindings (Core → Infrastructure)
    { provide: IProductRepository, useClass: ProductHttpRepository },
    { provide: ICategoryRepository, useClass: CategoryHttpRepository },

    // Service bindings (Core → Infrastructure)
    { provide: IAuthService, useClass: AuthHttpService },
    { provide: ITokenService, useClass: TokenService },
    { provide: IStorageService, useClass: StorageService }
  ]
};
