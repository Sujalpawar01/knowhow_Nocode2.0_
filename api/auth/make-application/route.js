import { NextResponse } from "next/server";
import connectDB from "@/app/lib/db";
import Application from "@/app/models/applications";
import rtouser1 from "@/app/models/rtouser";
import jwt from "jsonwebtoken";

export async function POST(req) {
  await connectDB();

  try {
    const cookies = req.cookies;
    const token = cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized. No token provided." }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    if (!userId) {
      return NextResponse.json({ error: "Invalid token. User ID not found." }, { status: 401 });
    }

    const user = await rtouser1.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Parse JSON request body
    const formData = await req.json();

    // Validate and transform data
    const { service, doneDate, status,registerid } = formData;

    if (!service || !doneDate || !status) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    // Convert `doneDate` to a Date object
    const applicationDetails = new Application({
      service,
      doneDate: new Date(doneDate), // Convert string to Date
      status,
      registerid, // Use userId as registerid
      city: user.city, // Assign city from user data
    });

    // Save to the database
    await applicationDetails.save();
    console.log("Application saved successfully:", applicationDetails);

    return NextResponse.json(
      { message: "Application details saved successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}

// Configure API route options
export const config = {
  api: {
    bodyParser: false,
  },
};
