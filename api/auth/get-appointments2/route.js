import connectDB from "@/app/lib/db";
import BookAppointment from "@/app/models/appointment";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers"; // Import cookies to access cookies in Next.js
import { NextResponse } from "next/server"; // Import NextResponse
import rtouser1 from "@/app/models/rtouser";

export async function GET(req) {
    await connectDB();
    try {
        // Get the token from the cookies
        const token = req.cookies.get('token');
        console.log(token);

        // If token is not found, return unauthorized response
        if (!token) {
            return NextResponse.json(
                { success: false, message: "Token not found" },
                { status: 401 }
            );
        }

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

        const registerid = decoded.id; // The decoded ID is the registerid (user._id from the token)
        console.log(decoded.id)
        const rto = await rtouser1.findById(registerid);

        // Fetch appointments that match the registerid
        const appointments = await BookAppointment.find({
            city: { $regex: new RegExp(`^${rto.city}$`, "i") },
            role: "citizen",
        });

        // console.lof()

        console.log(rto.city,"uuuuuuuuuuuuuuuuuu", appointments);
        console.log()
        return NextResponse.json(
            { success: true, data: appointments },
            { status: 200 }
        );

    } catch (error) {
        console.error(error); // Log the error for debugging
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
