import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import UserDetails from '@/app/models/UserDetails';
import User from '@/app/models/User';

export async function GET(req) {
  const token = req.cookies.get('token'); // Get token from the cookie
  console.log("mmmmmmmmm",token," mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm");

  if (!token) {
    return NextResponse.json({ error: 'No token provided' }, { status: 401 });
  }

  try {
    // Verify the token
    // console.log("aaaaaaaaaaaaaaaaaaa")
    console.log("1");
    const decoded = jwt.verify(token.value, process.env.JWT_SECRET);
    console.log("2");
    // console.log(decoded," AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAa")
    // console.log("aaaaaaaaaaaaaaa",decoded);
    const id=await decoded.id;
    console.log(id);

    const user= await UserDetails.findOne({userId:id});
    const useme=await User.findById(id);
    console.log("3");
    if(!user)
    {
      console.log("user not found");
      return NextResponse.json({ message: 'Token is valid', user: decoded, rolex:"citizen",namex:useme.name }, { status: 200 });
    }
    else
    {
      console.log("user found",user.position);
      if(user.position!="")
      {
        // console.log("I am a jawan")
        return NextResponse.json({ message: 'Token is valid', user: decoded, rolex:"special",namex:useme.name }, { status: 200 });
      }

    }


    return NextResponse.json({ message: 'Token is valid', user: decoded, rolex:"citizen",namex:useme.name }, { status: 200 });




    // Token is valid
    
  } catch (error) {
    console.log("catch")
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  }
}