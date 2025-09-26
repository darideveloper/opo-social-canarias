import type { APIRoute } from 'astro';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-change-this-in-production';

export const POST: APIRoute = async ({ cookies }) => {
  try {
    const refreshToken = cookies.get('refresh_token')?.value;

    if (!refreshToken) {
      return new Response(JSON.stringify({
        success: false,
        message: 'No refresh token provided'
      }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as any;
    
    if (decoded.type !== 'refresh') {
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

    // Create new access token
    const newAccessToken = jwt.sign(
      { 
        userId: decoded.userId, 
        email: decoded.email,
        type: 'access'
      },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    // Set new access token cookie
    cookies.set('access_token', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60, // 15 minutes
      path: '/'
    });

    return new Response(JSON.stringify({
      success: true,
      message: 'Token refreshed successfully'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    
    // Clear invalid tokens
    cookies.delete('access_token', { path: '/' });
    cookies.delete('refresh_token', { path: '/' });

    return new Response(JSON.stringify({
      success: false,
      message: 'Invalid refresh token'
    }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
