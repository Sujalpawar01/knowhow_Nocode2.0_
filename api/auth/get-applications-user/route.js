import connectDB from "@/app/lib/db";
import Application from "@/app/models/applications";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers"; // Import cookies to access cookies in Next.js
import { NextResponse } from "next/server"; // Import NextResponse

export async function GET(req) {
    await connectDB();
    
    try {
        // Get the token from cookies using next/headers
        const cookieStore = await cookies();
        const token = cookieStore.get('token'); // Adjusted to Next.js 13 cookie handling
        console.log(token);

        // If token is not found, return unauthorized response
        if (!token) {
            return NextResponse.json(
                { success: false, message: "Token not found" },
                { status: 401 }
            );
        }

        const url = new URL(req.url);
        const id = url.searchParams.get('id');

        // Verify the token and extract the user id (registerid)
        let decoded;
        try {
            decoded = jwt.verify(token.value, process.env.JWT_SECRET); // Verify the JWT token using the secret
        } catch (error) {
            return NextResponse.json(
                { success: false, message: "Invalid or expired token" },
                { status: 401 }
            );
        }

        const registerid = id; // The decoded ID is the registerid (user._id from the token)
        console.log(registerid,"aaaaaaaaaaaaa")
        // Fetch appointments that match the registerid
        const applications = await Application.find({ registerid });

        if (!applications || applications.length === 0) {
            return NextResponse.json(
                { success: false, message: "No applications found" },
                { status: 404 }
            );
        }

        // console.log(applications)

        return NextResponse.json(applications, { status: 200 });

    } catch (error) {
        console.error(error); // Log the error for debugging
        return NextResponse.json(
            { success: false, message: error.message || "An error occurred" },
            { status: 500 }
        );
    }
}
