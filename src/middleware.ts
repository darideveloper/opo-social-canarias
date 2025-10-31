// src/middleware.ts
import { defineMiddleware } from "astro:middleware";

// Define which routes require authentication
const protectedRoutes = [
  "/dashboard",
];

// Define routes to redirect to /dashboard if authenticated
const redirectRoutes = [
  "/login",
  "/sign-up",
  "/reset-password",
  "/activate",
];

// Helper function to check if route
function isRoute(pathname: string, routes: string[]): boolean {
  return routes.some(route => pathname.startsWith(route));
}

// helper function to check iof the access token is valid
function isAccessTokenValid(cookies: any): boolean {
  // Check for your authentication cookie
  const token = cookies.get("access_token");
    
  // If cookie doesn't exist or is empty, redirect to login
  if (!token || !token.value) {
    return false;
  }
  return true;
}

export const onRequest = defineMiddleware(async (context, next) => {
  const { cookies, url, redirect } = context;
  
  // Protected pages system
  if (isRoute(url.pathname, protectedRoutes)) {
    if (!isAccessTokenValid(cookies)) {
      return redirect("/login");
    }
  }

  if (isRoute(url.pathname, redirectRoutes)) {
    if (isAccessTokenValid(cookies)) {
      return redirect("/dashboard");
    }
  }
  
  // Continue to the next middleware or route
  return next();
});