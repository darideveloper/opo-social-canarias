import type { APIRoute } from 'astro';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

// Mock user database - replace with your actual database
const users = [
  {
    id: '1',
    email: 'admin@example.com',
    password: 'password123', // In production, this should be hashed
    name: 'Admin User'
  },
  {
    id: '2',
    email: 'user@example.com',
    password: 'password123',
    name: 'Regular User'
  }
];

export const GET: APIRoute = async ({ cookies }) => {
  try {
    const accessToken = cookies.get('access_token')?.value;

    if (!accessToken) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Las credenciales de autenticación no se proveyeron.'
      }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Verify access token
    const decoded = jwt.verify(accessToken, JWT_SECRET) as any;
    
    if (decoded.type !== 'access') {
      return new Response(JSON.stringify({
        success: false,
        message: 'Invalid token type'
      }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Find user in mock database
    const user = users.find(u => u.id === decoded.userId);
    
    if (!user) {
      return new Response(JSON.stringify({
        success: false,
        message: 'User not found'
      }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Auth check error:', error);
    
    // Clear invalid tokens
    cookies.delete('access_token', { path: '/' });
    cookies.delete('refresh_token', { path: '/' });

    return new Response(JSON.stringify({
      success: false,
      message: 'Las credenciales de autenticación no se proveyeron.'
    }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
