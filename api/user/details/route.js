// import connectDB from '@/app/lib/db'; // Ensure you have a dbConnect utility to connect to MongoDB
// import User from '@/app/models/User'; // Adjust the path based on your project structure
// import UserDetails from '@/app/models/UserDetails'; // Adjust the path based on your project structure
// import { NextResponse } from 'next/server'; // Import the NextResponse object

// // Named export for GET handler
// export async function GET(req) {
//     try {
//         // Use req.nextUrl.searchParams to access query parameters in Next.js 13
//         const id = req.nextUrl.searchParams.get('id');

//         console.log(id);

//         if (!id) {
//             return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
//         }

//         // Fetch user details from the UserDetails collection based on userId
//         const userDetails = await UserDetails.findOne({ userId: id });
//         // if (!userDetails) {
//         //     return NextResponse.json({ message: 'User details not found' }, { status: 404 });
//         // }

//         // Fetch the user info from the User collection based on _id
//         const user = await User.findById(id).exec();
//         if (!user) {
//             return NextResponse.json({ message: 'User not found' }, { status: 404 });
//         }

//         // Combine the user info and user details
//         const userData = {
//             name: user.name,
//             email: user.email,
//             position: userDetails ? userDetails.position : "Common Man",
//         };

//         console.log(userData);

//         return NextResponse.json(userData, { status: 200 }); // Return the user data as response
//     } catch (error) {
//         console.error(error);
//         return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
//     }
// }





import connectDB from '@/app/lib/db'; // Database connection utility
import User from '@/app/models/User'; // User model
import UserDetails from '@/app/models/UserDetails'; // UserDetails model
import { NextResponse } from 'next/server'; // Next.js response handler

export async function GET(req) {
    try {
        // Connect to the database
        await connectDB();

        // Access the query parameter 'id' from the request
        const id = req.nextUrl.searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { message: 'User ID is required' },
                { status: 400 }
            );
        }

        console.log(`Fetching data for user ID: ${id}`);

        // Fetch user details from the UserDetails collection based on userId
        const userDetails = await UserDetails.findOne({ userId: id });

        // Fetch user info from the User collection based on _id
        const user = await User.findById(id).exec();
        if (!user) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 404 }
            );
        }

        // Combine the user info and user details
        const userData = {
            name: user.name,
            email: user.email,
            position: userDetails ? userDetails.position : 'Common Man',
        };

        console.log('User Data:', userData);

        // Return the combined user data as JSON response
        return NextResponse.json(userData, { status: 200 });
    } catch (error) {
        console.error('Error fetching user details:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
