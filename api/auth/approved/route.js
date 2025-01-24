// api/auth/approved/route.js
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import UserDetails from '@/app/models/UserDetails';

export async function GET(req) {
  const token = req.cookies.get('token');
  
  if (!token) {
    return NextResponse.json({ appro: false, error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token.value, process.env.JWT_SECRET);
    const userId = decoded.id;

    if (!userId) {
      return NextResponse.json({ appro: false, error: "Invalid token" });
    }

    // Use await with findOne and fix the query syntax
    const user = await UserDetails.findOne({ userId: userId });
    console.log("zzzzzzzzzzzzzz",user)
    
    if (!user) {
      return NextResponse.json({ appro: false, error: "No User" });
    }
    console.log("hihihihihihi")

    // Return the approved status from the user document
    return NextResponse.json({ appro: user.approved });

  } catch(e) {
    console.error(e);
    return NextResponse.json({ appro: false, error: e.message }, { status: 500 });
  }
}