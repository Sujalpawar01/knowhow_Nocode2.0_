'use client';

import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

export default function Appointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch appointments when the component mounts
    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await fetch('/api/auth/get-appointmenter');
                const data = await response.json();

                if (data.success) {
                    setAppointments(data.data); // Set the appointments data
                } else {
                    setError(data.message); // Handle any errors
                }
            } catch (error) {
                setError('Failed to fetch appointments'); // Handle network or fetch error
            } finally {
                setLoading(false); // Set loading to false once data is fetched
            }
        };

        fetchAppointments();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-white">
                <div className="text-center">
                    <div className="animate-spin border-t-4 border-b-4 border-blue-500 w-16 h-16 rounded-full mx-auto"></div>
                    <p className="text-gray-700 mt-4">Loading appointments...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-white">
                <div className="bg-red-500 text-white p-6 rounded-lg shadow-xl">
                    <h2 className="text-xl font-semibold">Error</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <>
        <Navbar/>
        <div className="min-h-[80%] bg-gray-50 flex items-center justify-center py-8">
            <div className="mx-auto p-6 w-full max-w-5xl bg-white shadow-lg rounded-xl">
                <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">All Booked Appointments</h1>

                {appointments.length === 0 ? (
                    <div className="text-center text-gray-600 py-4">No appointments available.</div>
                ) : (
                    <table className="min-w-full table-auto text-gray-800 border-separate border-spacing-2">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="py-3 px-6 text-left">Service</th>
                                <th className="py-3 px-6 text-left">Date</th>
                                <th className="py-3 px-6 text-left">Register ID</th>
                                <th className="py-3 px-6 text-left">Approved</th>
                                <th className="py-3 px-6 text-left">Done</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map((appointment) => (
                                <tr key={appointment._id} className="hover:bg-gray-100">
                                    <td className="py-3 px-6">{appointment.option}</td>
                                    <td className="py-3 px-6">{new Date(appointment.date).toLocaleDateString()}</td>
                                    <td className="py-3 px-6">{appointment.registerid}</td>
                                    <td className="py-3 px-6">
                                        {appointment.approved ? (
                                            <span className="text-green-500 font-semibold">Approved</span>
                                        ) : (
                                            <span className="text-red-500 font-semibold">Not Approved</span>
                                        )}
                                    </td>
                                    <td className="py-3 px-6">
                                        {appointment.done ? (
                                            <span className="text-green-500 font-semibold">Done</span>
                                        ) : (
                                            <span className="text-red-500 font-semibold">Not Done</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
        </>
    );
}
