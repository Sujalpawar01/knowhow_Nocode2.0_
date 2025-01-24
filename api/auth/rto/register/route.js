import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/app/lib/db";
import rtouser from "@/app/models/rtouser";

export async function POST(req) {
  console.log(process.env.MONGO_URI);
  await connectDB();

  const { city,name, email, password,pincode } = await req.json();

  try {
    console.log("12345678",email);
    const existingrtouser = await rtouser.findOne({ email });
    console.log("cheru")
    if (existingrtouser) {
      return NextResponse.json({ error: "rtouser already exists" }, { status: 400 });
    }
    console.log("2");
    const hashedPassword = await bcrypt.hash(password, 10);

    const newrtouser = new rtouser({ name, email, password: hashedPassword,pincode,city });
    console.log("rrrrrrrrrrrrrrr",newrtouser,city);
    await newrtouser.save();
    console.log("3");

    return NextResponse.json({ message: "rtouser registered successfully" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
