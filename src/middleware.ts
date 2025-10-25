// src/middleware.ts
import { defineMiddleware } from "astro:middleware";

// Define which routes require authentication
const protectedRoutes = [
  "/dashboard",
];

// Helper function to check if route is protected
function isProtectedRoute(pathname: string): boolean {
  return protectedRoutes.some(route => pathname.startsWith(route));
}

export const onRequest = defineMiddleware(async (context, next) => {
  const { cookies, url, redirect } = context;
  
  // Protected pages system
  if (isProtectedRoute(url.pathname)) {
    // Check for your authentication cookie
    const token = cookies.get("access_token");
    
    // If cookie doesn't exist or is empty, redirect to login
    if (!token || !token.value) {
      // Store the intended destination for redirect after login
      return redirect("/login");
    }
    
    // Return token in astro locals
    context.locals.isAuthenticated = true;
    context.locals.authToken = token.value;
  }
  
  // Continue to the next middleware or route
  return next();
});