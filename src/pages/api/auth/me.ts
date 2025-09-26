import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ locals }) => {
  const user = locals.user;
  
  if (!user) {
    return new Response(JSON.stringify({
      success: false,
      message: 'No access token provided'
    }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  return new Response(JSON.stringify({
    success: true,
    user: {
      id: user.userId,
      email: user.email,
      name: user.email.split('@')[0] // You might want to store this in your user data
    }
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
