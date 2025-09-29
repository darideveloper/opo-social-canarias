import { defineMiddleware } from 'astro:middleware';
import jwt from 'jsonwebtoken';
import type { Locals } from 'astro';

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

export const onRequest = defineMiddleware(async ({ request, cookies, locals }: { request: Request; cookies: any; locals: Locals }, next) => {
  // Skip authentication for static assets only
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  // Skip auth for static files only (no local API endpoints)
  if (
    pathname.startsWith('/_astro/') ||
    pathname.startsWith('/favicon') ||
    pathname === '/favicon.ico' ||
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

  // No local API routes to protect - all API calls go to external backend

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
