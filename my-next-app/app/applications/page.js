'use client';
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useRouter } from 'next/navigation';
import { AiOutlineReload } from 'react-icons/ai';
import { BiErrorCircle } from 'react-icons/bi';

const ApplicationsPage = () => {
    const router = useRouter();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [id, setRegisterId] = useState('');

    // Verify user authentication
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch('/api/auth/verify-token');
                if (!res.ok) {
                    router.push('/login');
                } else {
                    const data = await res.json();
                    setRegisterId(data.user.id);
                }
            } catch {
                router.push('/login');
            }
        };

        checkAuth();
    }, [router]);

    // Fetch applications for the authenticated user
    useEffect(() => {
        const fetchApplications = async () => {
            if (!id) return;

            try {
                const res = await fetch(`/api/auth/get-applications-user?id=${id}`);
                if (!res.ok) {
                    throw new Error('Failed to fetch applications');
                }

                const data = await res.json();
                setApplications(Array.isArray(data) ? data : []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-600">Loading applications...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-red-600">
                <BiErrorCircle size={50} />
                <p className="text-lg font-semibold mt-4">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="flex items-center gap-2 px-4 py-2 mt-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    <AiOutlineReload />
                    Retry
                </button>
            </div>
        );
    }

    return (
        <>
            <Navbar/>
        <div className="container mx-auto p-6 bg-white shadow-md rounded-lg mt-4 max-w-[70%]">
            <h1 className="text-4xl font-bold mb-6 text-center text-blue-600">
                Applications
            </h1>

            {applications.length === 0 ? (
                <div className="text-center">
                    <p className="text-xl text-gray-600 mb-4">No applications found.</p>
                    <img
                        src="/no-data.svg"
                        alt="No data"
                        className="mx-auto w-48 h-48 opacity-75"
                    />
                </div>
            ) : (
                <div className="overflow-x-auto shadow-md rounded-lg">
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr className="bg-blue-600 text-white">
                                <th className="px-6 py-4 text-left">Service</th>
                                <th className="px-6 py-4 text-left">Done Date</th>
                                <th className="px-6 py-4 text-left">Status</th>
                                <th className="px-6 py-4 text-left">Register ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.map((application) => (
                                <tr
                                    key={application._id}
                                    className="hover:bg-gray-100 transition"
                                >
                                    <td className="border px-6 py-3 text-gray-700">
                                        {application.service}
                                    </td>
                                    <td className="border px-6 py-3 text-gray-700">
                                        {new Date(application.doneDate).toLocaleDateString()}
                                    </td>
                                    <td className="border px-6 py-3">
                                        <span
                                            className={`px-3 py-1 rounded-full text-white text-sm ${
                                                application.status === 'Completed'
                                                    ? 'bg-green-500'
                                                    : 'bg-yellow-500'
                                            }`}
                                        >
                                            {application.status}
                                        </span>
                                    </td>
                                    <td className="border px-6 py-3 text-gray-700">
                                        {application.registerid}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
        </>
    );
};

export default ApplicationsPage;
