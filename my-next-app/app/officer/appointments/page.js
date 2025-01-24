'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/app/components/Navbar';
import { useRouter } from 'next/navigation';

export default function Appointments() {
    const [appointments, setAppointments] = useState([]);
    const [appointments1, setAppointments1] = useState([]);
    const [doneAppointments, setDoneAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();

    // Fetch both sets of appointments
    useEffect(() => {
        const fetchAllAppointments = async () => {
            try {
                const [response1, response2] = await Promise.all([
                    fetch('/api/auth/get-appointments'),
                    fetch('/api/auth/get-appointments2'),
                ]);

                const data1 = await response1.json();
                const data2 = await response2.json();

                if (data1.success) {
                    setAppointments(data1.data.filter((appt) => !appt.done)); // Only non-done appointments
                    setDoneAppointments(data1.data.filter((appt) => appt.done)); // Done appointments
                } else {
                    setError(data1.message);
                }

                if (data2.success) {
                    setAppointments1(data2.data.filter((appt) => !appt.done));
                    setDoneAppointments((prev) => [...prev, ...data2.data.filter((appt) => appt.done)]);
                } else {
                    setError(data2.message);
                }
            } catch (error) {
                setError('Failed to fetch appointments');
            } finally {
                setLoading(false);
            }
        };

        fetchAllAppointments();
    }, []);

    const sortAppointments = (appointmentsList) =>
        [...appointmentsList].sort((a, b) => {
            if (a.approved !== b.approved) {
                return a.approved ? -1 : 1;
            }
            return new Date(a.date) - new Date(b.date);
        });

    const handleApproval = async (id, status) => {
        try {
            const res = await fetch(`/api/auth/update-appointment/approve?id=${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ approved: status }),
            });

            if (res.ok) {
                setAppointments((prev) =>
                    sortAppointments(
                        prev.map((appointment) =>
                            appointment._id === id ? { ...appointment, approved: status } : appointment
                        )
                    )
                );
                setAppointments1((prev) =>
                    sortAppointments(
                        prev.map((appointment) =>
                            appointment._id === id ? { ...appointment, approved: status } : appointment
                        )
                    )
                );
            } else {
                alert('Failed to update approval status');
            }
        } catch (error) {
            alert('An error occurred while updating approval status');
        }
    };

    const handleDone = async (id, status) => {
        try {
            const res = await fetch(`/api/auth/update-appointment/done?id=${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ done: status }),
            });

            if (res.ok) {
                setAppointments((prev) => {
                    const updatedAppointments = prev.filter((appointment) => appointment._id !== id);
                    return updatedAppointments;
                });

                setAppointments1((prev) => {
                    const updatedAppointments1 = prev.filter((appointment) => appointment._id !== id);
                    return updatedAppointments1;
                });

                if (status) {
                    const doneAppointment = [...appointments, ...appointments1].find((appt) => appt._id === id);
                    if (doneAppointment) {
                        setDoneAppointments((prev) => sortAppointments([...prev, { ...doneAppointment, done: true }]));
                    }
                } else {
                    const undoneAppointment = doneAppointments.find((appt) => appt._id === id);
                    if (undoneAppointment) {
                        setAppointments((prev) => sortAppointments([...prev, { ...undoneAppointment, done: false }]));
                        setAppointments1((prev) => sortAppointments([...prev, { ...undoneAppointment, done: false }]));
                        setDoneAppointments((prev) => prev.filter((appt) => appt._id !== id));
                    }
                }
            } else {
                alert('Failed to update done status');
            }
        } catch (error) {
            alert('An error occurred while updating done status');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="text-center">
                    <div className="animate-spin border-t-4 border-b-4 border-blue-500 w-16 h-16 rounded-full mx-auto"></div>
                    <p className="text-gray-700 mt-4">Loading appointments...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="bg-red-500 text-white p-4 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold">Error</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    const handlebut = async (id) => {
        router.push(`/officer/make-application/?id=${id}`);
    };

    const sortedAppointments = sortAppointments([...appointments, ...appointments1]);

    return (
        <><Navbar/>
        <div className="min-h-[80%] bg-white flex flex-col items-center justify-center pt-4">
            <div className="mx-auto p-6 w-full max-w-6xl bg-white shadow-xl rounded-lg mb-6">
                <h1 className="text-3xl font-semibold mb-4 text-center text-gray-900">All Booked Appointments</h1>
                {sortedAppointments.length === 0 ? (
                    <div className="text-center text-gray-500 py-4">No appointments available.</div>
                ) : (
                    <table className="min-w-full table-auto text-gray-700 border-separate border-spacing-2">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="py-2 px-4 text-left">Name</th>
                                <th className="py-2 px-4 text-left">Service</th>
                                <th className="py-2 px-4 text-left">Date</th>
                                <th className="py-2 px-4 text-left">Register ID</th>
                                <th className="py-2 px-4 text-left">Role</th>
                                <th className="py-2 px-4 text-left">Approved</th>
                                <th className="py-2 px-4 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedAppointments.map((appointment) => (
                                <tr key={appointment._id} className="hover:bg-gray-100">
                                    <td className="py-2 px-4">{appointment.name}</td>
                                    <td onClick={() => handlebut(appointment.registerid)} className="py-2 px-4 cursor-pointer">{appointment.option}</td>
                                    <td className="py-2 px-4">{new Date(appointment.date).toLocaleDateString()}</td>
                                    <td className="py-2 px-4">{appointment._id}</td>
                                    <td className="py-2 px-4">{appointment.role}</td>
                                    <td className="py-2 px-4">
                                        {appointment.approved ? (
                                            <span className="text-green-500">Approved</span>
                                        ) : (
                                            <span className="text-red-500">Pending</span>
                                        )}
                                    </td>
                                    <td className="py-2 px-4 flex space-x-2 justify-around">
                                        {appointment.approved ? (
                                            <button
                                                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                                                onClick={() => handleApproval(appointment._id, false)}
                                            >
                                                Reject
                                            </button>
                                        ) : (
                                            <button
                                                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                                                onClick={() => handleApproval(appointment._id, true)}
                                            >
                                                Approve
                                            </button>
                                        )}

                                        {appointment.done ? (
                                            <button
                                                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                                                onClick={() => handleDone(appointment._id, false)}
                                            >
                                                Mark Not Done
                                            </button>
                                        ) : (
                                            <button
                                                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                                                onClick={() => handleDone(appointment._id, true)}
                                            >
                                                Mark Done
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="mx-auto p-6 w-full max-w-6xl bg-white shadow-xl rounded-lg">
                <h2 className="text-2xl font-semibold mb-4 text-center text-gray-900">Done Appointments</h2>
                {doneAppointments.length === 0 ? (
                    <div className="text-center text-gray-500 py-4">No done appointments available.</div>
                ) : (
                    <table className="min-w-full table-auto text-gray-700 border-separate border-spacing-2">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="py-2 px-4 text-left">Name</th>
                                <th className="py-2 px-4 text-left">Service</th>
                                <th className="py-2 px-4 text-left">Date</th>
                                <th className="py-2 px-4 text-left">Register ID</th>
                                <th className="py-2 px-4 text-left">Role</th>
                                <th className="py-2 px-4 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {doneAppointments.map((appointment) => (
                                <tr key={appointment._id} className="hover:bg-gray-100">
                                    <td className="py-2 px-4">{appointment.name}</td>
                                    <td className="py-2 px-4">{appointment.option}</td>
                                    <td className="py-2 px-4">{new Date(appointment.date).toLocaleDateString()}</td>
                                    <td className="py-2 px-4">{appointment._id}</td>
                                    <td className="py-2 px-4">{appointment.role}</td>
                                    <td className="py-2 px-4">
                                        <button
                                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                                            onClick={() => handleDone(appointment._id, false)}
                                        >
                                            Mark Not Done
                                        </button>
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
