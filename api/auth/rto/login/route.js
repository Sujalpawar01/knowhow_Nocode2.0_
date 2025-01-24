import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectDB from "@/app/lib/db";
import rtouser1 from "@/app/models/rtouser";

export async function POST(req) {
    // console.log("-11111111111111111111");
  await connectDB();
  console.log(9);

  const { email, password } = await req.json();
  console.log(10);
  try {
    console.log(9);
    const rtouser = await rtouser1.findOne({ email });
    console.log("1");
    if (!rtouser) {
      console.log("45");
      return NextResponse.json({ error: "Invalid credentials" });
      console.log("45");
    }
    console.log("1");

    const isMatch = await bcrypt.compare(password, rtouser.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
    }
    console.log("1");

    // const data={email:email};

    const token = jwt.sign({ id: rtouser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    console.log("1");
    const response = NextResponse.json({ message: "Login successful" });
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600,
      sameSite: "strict",
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}