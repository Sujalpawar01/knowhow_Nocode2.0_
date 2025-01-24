import connectDB from "@/app/lib/db";
import Application from "@/app/models/applications";
import rtouser1 from "@/app/models/rtouser"; // Hypothetical model for users or registerid storage
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req) {
    await connectDB();

    try {
        // Get the token from cookies
        const cookieStore = await cookies();
        const token = cookieStore.get('token');

        if (!token) {
            return NextResponse.json(
                { success: false, message: "Token not found" },
                { status: 401 }
            );
        }

        // Parse the URL to get query parameters
        const url = new URL(req.url);
        const id = url.searchParams.get('id');

        // Verify the token
        let decoded;
        try {
            decoded = jwt.verify(token.value, process.env.JWT_SECRET);
        } catch (error) {
            return NextResponse.json(
                { success: false, message: "Invalid or expired token" },
                { status: 401 }
            );
        }

        // Fetch the user by registerid and retrieve the city
        const user = await rtouser1.findById(id);
        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        const city = user.city;
        console.log(city, " cityyyyyyyyyyyyyyy")
        if (!city) {
            return NextResponse.json(
                { success: false, message: "City not found for the user" },
                { status: 404 }
            );
        }

        // Fetch applications based on the city
        // Perform a case-insensitive search for city
        const applications = await Application.find({ city: { $regex: new RegExp(`^${city}$`, 'i') } });

        console.log(applications," aplplkdsjhbgs,jbg")
        if (!applications || applications.length === 0) {
            return NextResponse.json(
                { success: false, message: "No applications found for the city" }
            );
        }

        return NextResponse.json(applications, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { success: false, message: error.message || "An error occurred" },
            { status: 500 }
        );
    }
}
