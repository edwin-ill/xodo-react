import { NextResponse } from 'next/server';

export async function POST(request) {
  const { username, password } = await request.json();

  // Perform your authentication logic here
  if (username === 'admin' && password === 'password') {
    return NextResponse.json({ message: 'Login successful' }, { status: 200 });
  } else {
    return NextResponse.json({ message: 'Invalid username or password' }, { status: 401 });
  }
}