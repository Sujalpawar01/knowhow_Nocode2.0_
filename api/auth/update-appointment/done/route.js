import connectDB from '@/app/lib/db'; // Adjust the path to your dbConnect utility
import BookAppointment from '@/app/models/appointment'; // Adjust the path to your Appointment model
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

// Handle the PATCH request
export async function PATCH(req) {
    try {
        // Parse the query string
        const url = new URL(req.url);
        const id = url.searchParams.get('id');

        if (!id) {
            return NextResponse.json({ success: false, message: 'Missing appointment ID' }, { status: 400 });
        }


        // Parse the body
        const body = await req.json();
        const { done } = body;
        console.log(id, done, "  vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv")

        if (typeof done !== 'boolean') {
            return NextResponse.json({ success: false, message: 'Invalid approved status' }, { status: 400 });
        }

        // Connect to the database
        await connectDB();
        console.log('Mongoose connection state:', mongoose.connection.readyState);

        const updatedAppointment = await BookAppointment.findByIdAndUpdate(
            id,
            { done },
            { new: true }
        );

        // if (!updatedAppointment) {
        //     return NextResponse.json({ success: false, message: 'Appointment not found' }, { status: 404 });
        // }
        return NextResponse.json({ done: true })

        // return NextResponse.json({ success: true, data: updatedAppointment }, { status: 200 });
    } catch (error) {
        console.error('Error in PATCH request:', error);
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}

// Handle unsupported methods
export async function OPTIONS() {
    return NextResponse.json({ methods: ['PATCH'] });
}
