import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    // Clear the token cookie
    const response = NextResponse.json({ success: true });
    response.cookies.set('token', '', { maxAge: -1 }); // Clear the token

    return response;
  } catch (error) {
    console.error('Signout error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
