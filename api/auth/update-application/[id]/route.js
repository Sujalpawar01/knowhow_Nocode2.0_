// app/api/auth/update-application/[id]/route.js

import { NextResponse } from "next/server";
import connectDB from "@/app/lib/db";
import Application from "@/app/models/applications";

export async function PUT(req, { params }) {
  const { id } = params;

  await connectDB();

  try {
    // Parse the request body
    const formData = await req.json();

    // Find the application by ID and update it
    const updatedApplication = await Application.findByIdAndUpdate(id, formData, { new: true });

    if (!updatedApplication) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    return NextResponse.json(updatedApplication, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
