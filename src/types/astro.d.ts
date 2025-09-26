// Extend Astro's locals to include user
declare module 'astro' {
  interface Locals {
    user?: {
      userId: string;
      email: string;
      type: string;
    };
  }
}
