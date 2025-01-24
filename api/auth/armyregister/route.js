import { NextResponse } from "next/server";
import connectDB from "@/app/lib/db";
import UserDetails from "@/app/models/UserDetails";
import jwt from "jsonwebtoken";
import { writeFile, unlink, mkdir, access } from "fs/promises";
import { join } from "path";

export async function POST(req) {
  await connectDB();

  try {
    // Verify authentication
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

    // Parse multipart form data
    const formData = await req.formData();
    const idCardFile = formData.get("idCard");
    const position = formData.get("position");
    const aadharCardNo = formData.get("aadharCardNo");
    const defenceIdNo = formData.get("defenceIdNo");

    // Validate all required fields
    if (!position || !aadharCardNo || !defenceIdNo || !idCardFile) {
      return NextResponse.json(
        { error: "All fields (position, aadharCardNo, defenceIdNo, idCard) are required." },
        { status: 400 }
      );
    }

    // Validate file type
    if (!idCardFile.type || idCardFile.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are allowed." },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadDir = join(process.cwd(), "uploads");
    try {
      await access(uploadDir);
    } catch {
      await mkdir(uploadDir, { recursive: true });
    }

    // Save the file
    const bytes = await idCardFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `${Date.now()}-${idCardFile.name}`;
    const filePath = join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    // Save user details to database
    const newUserDetails = new UserDetails({
      userId,
      position,
      aadharCardNo,
      defenceIdNo,
      idCard: filePath,
      approved:true,
    });

    await newUserDetails.save();

    return NextResponse.json({ message: "User details saved successfully!" }, { status: 200 });
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