import { defineMiddleware } from 'astro:middleware';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

export interface AuthenticatedUser {
  userId: string;
  email: string;
  type: string;
}

function verifyToken(token: string): AuthenticatedUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    if (decoded.type !== 'access') {
      return null;
    }
    
    return {
      userId: decoded.userId,
      email: decoded.email,
      type: decoded.type
    };
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

export const onRequest = defineMiddleware(async ({ request, cookies, locals }, next) => {
  // Skip authentication for auth endpoints and static assets
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  // Skip auth for auth endpoints, static files
  if (
    pathname.startsWith('/api/auth/') ||
    pathname.startsWith('/_astro/') ||
    pathname.startsWith('/favicon') ||
    pathname === '/favicon.svg' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml'
  ) {
    return next();
  }

  // Check for access token in cookies
  const accessToken = cookies.get('access_token')?.value;
  
  if (accessToken) {
    const user = verifyToken(accessToken);
    if (user) {
      // Add user to locals for use in pages and API routes
      locals.user = user;
    }
  }

  // For protected API routes, check authentication
  if (pathname.startsWith('/api/protected')) {
    if (!locals.user) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Authentication required'
      }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
  }

  // For protected pages, redirect to login if not authenticated
  const protectedPages = ['/dashboard'];
  if (protectedPages.includes(pathname) && !locals.user) {
    return Response.redirect(new URL('/login', request.url));
  }

  // For login/register pages, redirect to dashboard if already authenticated
  const authPages = ['/login', '/register'];
  if (authPages.includes(pathname) && locals.user) {
    return Response.redirect(new URL('/dashboard', request.url));
  }

  return next();
});
