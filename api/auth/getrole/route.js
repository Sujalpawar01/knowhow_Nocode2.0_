import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '@/app/models/User';

export async function GET(req) {
  const userid=req.registerid;
  const user1=  await User.findOne({userid});
  if(!user1)
  {
    alert("user1 not found");
    return NextResponse.json({ error: 'user1 not found' }, { status: 401 });
  }

  const role = await user1.position;
  console.log("mmmmmmmmmmmm",role);
  return NextResponse.json({ message: 'role is got', rolex:role }, { status: 200 });

  
}