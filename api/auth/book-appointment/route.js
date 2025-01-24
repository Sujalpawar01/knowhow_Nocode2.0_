import connectDB from "@/app/lib/db";
import BookAppointment from "@/app/models/appointment";
import { NextResponse } from "next/server";

export async function POST(req) {
    await connectDB(); // Ensure DB is connected
    try {
        const { option, date,city, registerid,roler,name } = await req.json(); // Parse the request body
        const namer=name;
        console.log("mmmmmmmmmmmm",roler)

        // Log the values for debugging
        console.log(option, date, registerid,city,namer, "  AAAMMMMMMMMMMMMMMMMMMMMMMMMMMMMM");

        const newAppointment = await BookAppointment.create({
            option,
            date,
            city,
            registerid,
            approved: false, // Optional, default is false
            done: false, // Optional, default is false
            role:roler,
            name:namer,

        });

        console.log("[[[[[[[[[[[[[[[[",newAppointment);


        await newAppointment.save();

        console.log('Appointment saved:', newAppointment);

        return NextResponse.json({ success: true, appointment: newAppointment }, { status: 200 });
    } catch (error) {
        console.error(error); // Log the error for debugging
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
