import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

const USERS = {
  [process.env.TESTER_USERNAME_1]: process.env.TESTER_PASSWORD_1,
  [process.env.TESTER_USERNAME_2]: process.env.TESTER_PASSWORD_2,
  // Add more testers as needed
};

export async function POST(request) {
  const { username, password } = await request.json();

  console.log("Received username:", username);
  console.log("Received password:", password);
  console.log("Stored USERNAME_1:", process.env.TESTER_USERNAME_1);
  console.log("Stored PASSWORD_1:", process.env.TESTER_PASSWORD_1);
  console.log("Stored USERNAME_2:", process.env.TESTER_USERNAME_2);
  console.log("Stored PASSWORD_2:", process.env.TESTER_PASSWORD_2);
  console.log("USERS object:", USERS);

  if (USERS[username] === password) {
    const token = 'test_auth_token';
    const cookie = serialize('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return new NextResponse(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Set-Cookie': cookie, 'Content-Type': 'application/json' },
    });
  } else {
    return new NextResponse(JSON.stringify({ success: false, message: 'Invalid credentials' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}