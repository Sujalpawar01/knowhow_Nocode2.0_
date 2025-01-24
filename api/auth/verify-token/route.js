import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(req) {
  const token = req.cookies.get('token'); // Get token from the cookie
  console.log(token," mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm");

  if (!token) {
    return NextResponse.json({ error: 'No token provided' }, { status: 401 });
  }

  try {
    // Verify the token
    // console.log("aaaaaaaaaaaaaaaaaaa")
    const decoded = jwt.verify(token.value, process.env.JWT_SECRET);
    // console.log(decoded," AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAa")

    // Token is valid
    return NextResponse.json({ message: 'Token is valid', user: decoded }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  }
}