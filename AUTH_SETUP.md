# JWT Authentication System Setup

This project now includes a complete JWT authentication system with cookie storage. Here's what has been implemented:

## Features

- ✅ JWT token-based authentication
- ✅ Secure HTTP-only cookies for token storage
- ✅ Access token (15 minutes) and refresh token (7 days)
- ✅ Automatic token refresh
- ✅ Protected API endpoints
- ✅ React context for authentication state
- ✅ Login and registration forms
- ✅ Dashboard with protected data access
- ✅ Logout functionality

## API Endpoints

### Authentication Endpoints
- `POST /api/auth/login/` - User login
- `POST /api/auth/register/` - User registration
- `POST /api/auth/logout/` - User logout
- `POST /api/auth/refresh/` - Refresh access token
- `GET /api/auth/me/` - Get current user info

### Protected Endpoints
- `GET /api/protected/` - Example protected endpoint

## Pages

- `/` - Home page with authentication status
- `/login` - Login form
- `/register` - Registration form
- `/dashboard` - Protected dashboard

## Demo Credentials

For testing purposes, use these credentials:
- **Email**: admin@example.com
- **Password**: password123

## Environment Variables

Create a `.env` file in the project root with:

```env
JWT_SECRET=your-secret-key-change-this-in-production
JWT_REFRESH_SECRET=your-refresh-secret-key-change-this-in-production
NODE_ENV=development
```

## Usage

### AuthService

```typescript
import { authService } from './src/lib/auth';

// Login
const response = await authService.login('email@example.com', 'password');

// Register
const response = await authService.register('email@example.com', 'password', 'Name');

// Get protected data
const data = await authService.getProtectedData();

// Logout
await authService.logout();
```

### React Context

```typescript
import { useAuth } from './src/contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  if (isAuthenticated) {
    return <div>Welcome, {user?.name}!</div>;
  }
  
  return <div>Please log in</div>;
}
```

## Security Features

- HTTP-only cookies prevent XSS attacks
- Secure flag for production environments
- SameSite strict for CSRF protection
- Short-lived access tokens (15 minutes)
- Automatic token refresh
- Server-side token validation

## File Structure

```
src/
├── lib/
│   ├── auth.ts              # AuthService class
│   └── authMiddleware.ts    # Server-side auth utilities
├── contexts/
│   └── AuthContext.tsx      # React authentication context
├── components/
│   ├── forms/
│   │   ├── login.tsx        # Login form
│   │   └── register.tsx     # Registration form
│   └── Dashboard.tsx        # Protected dashboard
└── pages/
    ├── api/
    │   ├── auth/
    │   │   ├── login.ts     # Login endpoint
    │   │   ├── register.ts  # Registration endpoint
    │   │   ├── logout.ts    # Logout endpoint
    │   │   ├── refresh.ts   # Token refresh endpoint
    │   │   └── me.ts        # User info endpoint
    │   └── protected.ts     # Example protected endpoint
    ├── login.astro          # Login page
    ├── register.astro       # Registration page
    ├── dashboard.astro      # Dashboard page
    └── index.astro          # Home page
```

## Testing

1. Start the development server: `npm run dev`
2. Navigate to `http://localhost:4321`
3. Try logging in with the demo credentials
4. Test the protected dashboard
5. Try accessing protected API endpoints

## Production Considerations

- Change JWT secrets to strong, random values
- Use environment variables for all secrets
- Implement proper password hashing (bcrypt)
- Add rate limiting for auth endpoints
- Use HTTPS in production
- Implement proper user database
- Add email verification for registration
- Add password reset functionality
