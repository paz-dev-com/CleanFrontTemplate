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

```bash
# Unit tests with Vitest
ng test

# E2E tests
ng e2e

# With coverage
ng test --code-coverage
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
