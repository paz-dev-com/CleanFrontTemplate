# Clean Architecture Angular Template

A production-ready Angular template following **Clean Architecture** principles, matching the structure of [CleanApiTemplate](https://github.com/paz-dev-com/CleanApiTemplate).

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Configure API URL (edit src/environments/environment.ts)
# Set your backend API URL - default: https://localhost:7164/api

# Start development server
npm start

# Navigate to http://localhost:4200/
```

## 🏗️ Architecture Overview

The project follows **Clean Architecture** principles with four distinct layers:

### 1. **Core Layer** (Domain - Zero Dependencies)
```
core/
├── entities/       # Product, Category, User, BaseEntity
├── interfaces/     # IProductRepository, IAuthService, etc.
├── models/         # Result<T>, PaginatedResult<T>
└── enums/          # UserRole enum
```
- Pure business logic
- No external dependencies
- Defines contracts (interfaces) for outer layers

### 2. **Features Layer** (CQRS Pattern)
- **Products Feature**
  - Commands: CreateProduct, UpdateProduct, DeleteProduct
  - Queries: GetProducts, GetProductById
  - Service: ProductService (orchestration)
  - Components: List, Detail, Form

- **Auth Feature**
  - Login component with validation
  - Auth service with JWT handling
  - Token management

### 3. **Infrastructure Layer**
- HTTP Repositories: ProductHttpRepository, CategoryHttpRepository
- Services: TokenService, StorageService, AuthHttpService
- Interceptors: Auth & Error handling
- API communication layer

### 4. **Shared Layer**
- Header component with navigation
- Loading spinner component
- Guards: authGuard, roleGuard
- Pipes: truncate
- Directives: hasRole

## 📋 Features

### ✅ Authentication System
- Login with form validation
- JWT token management
- Protected routes with auth guard
- Role-based access control
- Automatic token refresh

### ✅ Product Management (Full CRUD)
- List products with pagination & search
- View product details
- Create new products
- Edit existing products
- Delete products with confirmation
- Responsive grid layout

### ✅ Layout & Navigation
- Header with navigation menu
- User menu with logout
- Responsive design
- Modern, clean styling

## ⚙️ Configuration

### Environment Variables

Update `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'https://localhost:7164/api' // Your backend API URL
};
```

### API Endpoints

The app expects these backend endpoints:

- `POST /api/auth/login` - User authentication
- `GET /api/products` - List products (with pagination)
- `GET /api/products/{id}` - Get single product
- `POST /api/products` - Create product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product

## 📦 Development

### Start Development Server

```bash
ng serve
# or
npm start
```

Once running, navigate to `http://localhost:4200/`. The app will auto-reload on file changes.

### Available Routes

- `/auth/login` - Login page
- `/products` - Product list (protected)
- `/products/create` - Create new product
- `/products/:id` - Product details
- `/products/:id/edit` - Edit product

### Code Scaffolding

Generate new components:

```bash
ng generate component component-name
ng generate service service-name
ng generate guard guard-name
```

For all available schematics:

```bash
ng generate --help
```

### Building

```bash
# Development build
ng build

# Production build
ng build --configuration production
```

Build artifacts are stored in the `dist/` directory.

### Testing

The project uses **Vitest** as the testing framework with full Angular testing utilities support.

#### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- product.entity.spec.ts

# Run tests matching pattern
npm test -- --grep="LoginComponent"
```

#### Test Structure

All tests follow the `.spec.ts` naming convention and are co-located with their source files:

```
src/app/
├── core/
│   ├── entities/
│   │   ├── product.entity.ts
│   │   └── product.entity.spec.ts     ✓ Tests domain logic
│   └── models/
│       ├── result.model.ts
│       └── result.model.spec.ts       ✓ Tests result pattern
│
├── infrastructure/
│   ├── services/
│   │   ├── token.service.ts
│   │   └── token.service.spec.ts      ✓ Tests token management
│   └── repositories/
│       └── *.spec.ts                  ✓ Tests HTTP operations
│
├── features/
│   ├── products/
│   │   └── components/
│   │       └── *.spec.ts              ✓ Tests components
│   └── auth/
│       └── components/
│           └── login.component.spec.ts ✓ Tests authentication
│
└── shared/
    ├── guards/
    │   └── auth.guard.spec.ts         ✓ Tests route protection
    ├── pipes/
    │   └── truncate.pipe.spec.ts      ✓ Tests data transformation
    └── directives/
        └── has-role.directive.spec.ts ✓ Tests authorization
```

#### Test Coverage

The test suite includes:

- **Core Layer Tests** (70+ tests)
  - Entity validation and business logic
  - Result pattern (success/failure scenarios)
  - Paginated results

- **Infrastructure Tests** (60+ tests)
  - Token service (JWT parsing, expiration)
  - Storage service (localStorage abstraction)
  - HTTP repositories (mocked HTTP calls)

- **Feature Tests** (50+ tests)
  - Component initialization and lifecycle
  - User interactions (forms, buttons, navigation)
  - Service integration
  - Error handling

- **Shared Tests** (40+ tests)
  - Guards (authentication, authorization)
  - Pipes (truncate text)
  - Directives (conditional rendering)

#### Coverage Reports

After running tests with coverage, view the HTML report:

```bash
npm test -- --coverage
# Open coverage/index.html in your browser
```

Target coverage goals:
- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

#### Testing Best Practices

1. **Unit Tests**: Test individual components, services, and functions in isolation
2. **Mock Dependencies**: Use `vi.fn()` to mock services and external dependencies
3. **Test Behavior**: Focus on what the code does, not how it does it
4. **Descriptive Names**: Use clear test descriptions (it should...)
5. **Arrange-Act-Assert**: Structure tests with clear setup, execution, and verification
6. **Edge Cases**: Test error scenarios, null values, and boundary conditions

#### Writing New Tests

Example test structure:

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';

describe('MyComponent', () => {
  let component: MyComponent;
  let mockService: MyService;

  beforeEach(() => {
    mockService = {
      getData: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        MyComponent,
        { provide: MyService, useValue: mockService }
      ]
    });

    component = TestBed.inject(MyComponent);
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should load data on init', () => {
    vi.spyOn(mockService, 'getData').mockReturnValue(of([]));
    
    component.ngOnInit();
    
    expect(mockService.getData).toHaveBeenCalled();
  });
});
```

## 🐛 Troubleshooting

### Frontend Not Calling Backend API

#### Quick Checklist

1. **Is the backend API running?**
   - Check backend is on correct port (default: 7164)
   - Verify API URL in `environment.ts` matches

2. **CORS Configuration**
   Your backend MUST allow requests from Angular dev server.
   
   In your .NET API `Program.cs`:
   ```csharp
   builder.Services.AddCors(options =>
   {
       options.AddPolicy("AllowAngular", policy =>
       {
           policy.WithOrigins("http://localhost:4200")
                 .AllowAnyHeader()
                 .AllowAnyMethod()
                 .AllowCredentials();
       });
   });
   
   app.UseCors("AllowAngular");
   ```

3. **SSL Certificate Issues**
   - Visit `https://localhost:7164` directly in browser
   - Accept the self-signed certificate warning

#### Debugging Steps

1. **Open Browser DevTools (F12)**
   - Console tab: Look for 🔐, 📡, ✅, ❌ log messages
   - Network tab: Check for failed requests

2. **Common Errors**

   **Status 0 - "Cannot connect to server"**
   - API not running
   - Wrong API URL in environment.ts
   - CORS not configured
   - SSL certificate issue

   **Status 401 - "Unauthorized"**
   - Wrong credentials
   - Token expired
   - Backend auth not working

   **Status 404 - "Not Found"**
   - API endpoint doesn't exist
   - Check backend routes match expected endpoints

3. **Test Backend Directly**
   ```powershell
   # PowerShell
   Invoke-RestMethod -Uri "https://localhost:7164/api/auth/login" `
     -Method POST `
     -Body (@{username="admin";password="Admin@123"} | ConvertTo-Json) `
     -ContentType "application/json"
   ```

### Update API URL

If your backend uses a different port:

1. Open `src/environments/environment.ts`
2. Update `apiUrl` to match your backend
3. Restart the Angular dev server

### Default Test Credentials

If using [CleanApiTemplate](https://github.com/paz-dev-com/CleanApiTemplate):
- Username: `admin`
- Password: `Admin@123`

Or check your backend seed data.

## 🔧 Project Structure

```
src/
├── app/
│   ├── core/                  # Core layer (zero dependencies)
│   │   ├── entities/          # Domain entities
│   │   ├── interfaces/        # Contracts
│   │   └── models/            # Shared models
│   │
│   ├── features/              # Features (CQRS)
│   │   ├── products/
│   │   │   ├── commands/      # CreateProduct, UpdateProduct
│   │   │   ├── queries/       # GetProducts, GetProductById
│   │   │   ├── services/      # ProductService
│   │   │   └── components/    # UI components
│   │   └── auth/
│   │       ├── services/
│   │       └── components/
│   │
│   ├── infrastructure/        # External services
│   │   ├── http/              # HTTP repositories
│   │   ├── interceptors/      # Auth, Error
│   │   └── services/          # Token, Storage
│   │
│   └── shared/                # Shared utilities
│       ├── components/        # Header, Spinner
│       ├── guards/            # authGuard, roleGuard
│       ├── pipes/             # Custom pipes
│       └── directives/        # Custom directives
│
└── environments/              # Configuration
```

## 📚 Next Steps

### Recommended Enhancements

1. **Add Unit Tests**
   - Test services with mocked repositories
   - Test components with mocked services
   - Test guards and interceptors

2. **Add Categories Feature**
   - Category CRUD operations
   - Category selection in product form

3. **Add User Registration**
   - Registration form with validation
   - Email verification

4. **Improve UX**
   - Toast notifications
   - Loading states
   - Better error messages
   - Form validation feedback

5. **Additional Features**
   - User profile management
   - Dashboard with statistics
   - Export/import functionality
   - Advanced filtering and sorting

## 📖 Resources

- [Backend API Template](https://github.com/paz-dev-com/CleanApiTemplate) - Matching backend structure
- [Angular Documentation](https://angular.dev) - Official Angular docs
- [Angular CLI Reference](https://angular.dev/tools/cli) - CLI command reference
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) - Original article
- [CQRS Pattern](https://martinfowler.com/bliki/CQRS.html) - Command Query Responsibility Segregation
