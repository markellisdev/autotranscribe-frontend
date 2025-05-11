import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function POST(request) {
  // Create a serialized cookie with an expired date to delete it
  const cookie = serialize('authToken', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0, // Setting maxAge to 0 effectively deletes the cookie
  });

  return new NextResponse(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Set-Cookie': cookie, 'Content-Type': 'application/json' },
  });
}