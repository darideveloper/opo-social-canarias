import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ locals }) => {
  // User is already verified by middleware and available in locals
  const user = locals.user!; // We know it exists because middleware protects this route

  return new Response(JSON.stringify({
    success: true,
    data: {
      message: 'This is protected data!',
      userId: user.userId,
      email: user.email,
      timestamp: new Date().toISOString()
    }
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
