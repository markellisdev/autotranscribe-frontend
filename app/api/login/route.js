import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

// Store tester credentials server-side ONLY
const USERS = {
    [process.env.TESTER_USERNAME_1]: process.env.TESTER_PASSWORD_1,
    [process.env.TESTER_USERNAME_2]: process.env.TESTER_PASSWORD_2,
    // Add more testers as needed
};

export async function POST(request) {
  const { username, password } = await request.json();

  if (USERS[username] && USERS[username] === password) {
    // Authentication successful, set a cookie
    const token = 'test_auth_token'; // In a real app, generate a strong, unique token
    const cookie = serialize('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // Cookie expires in 7 days
    });

    return new NextResponse(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Set-Cookie': cookie, 'Content-Type': 'application/json' },
    });
  } else {
    // Authentication failed
    return new NextResponse(JSON.stringify({ success: false, message: 'Invalid credentials' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}