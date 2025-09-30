import { defineMiddleware } from 'astro:middleware';
import type { Locals } from 'astro';
import { AuthService } from './lib/auth';


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

  // For protected pages, redirect to login if not authenticated
  const protectedPages = ['/dashboard'];
  for (const page of protectedPages) {
    if (pathname.startsWith(page) && accessToken === undefined) {
      return Response.redirect(new URL('/login', request.url));
    }
  }
  // For login/register pages, redirect to dashboard if already authenticated
  const authPages = ['/login', '/register'];
  if (authPages.includes(pathname) && accessToken !== undefined) {
    return Response.redirect(new URL('/', request.url));
  }

  return next();
});
