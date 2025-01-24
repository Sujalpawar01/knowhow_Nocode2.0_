'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import QRCode from 'qrcode';
import Navbar from '../components/Navbar';
import { Spinner } from 'react-bootstrap'; // For loading spinner

const QrCodeGenerator = () => {
    const router = useRouter();
    const [registerId, setRegisterId] = useState('');
    const [userInfo, setUserInfo] = useState(null);
    const [qrCode, setQrCode] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const generateQrCode = async (data) => {
        try {
            const qr = await QRCode.toDataURL(data, { width: 300 });
            setQrCode(qr);
        } catch (err) {
            console.error('Error generating QR code:', err);
        }
    };

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch('/api/auth/verify-token');
                if (!res.ok) {
                    router.push('/login');
                    return;
                }
                const authData = await res.json();
                setRegisterId(authData.user.id);

                const userRes = await fetch(`/api/user/details?id=${authData.user.id}`);
                if (!userRes.ok) {
                    throw new Error('Failed to fetch user details');
                }
                const userData = await userRes.json();
                setUserInfo(userData);

                // Generate QR code after fetching user details
                const qrData = `Name: ${userData.name}\nEmail: ${userData.email}\nPosition: ${userData.position}\nID: ${authData.user.id}`;
                generateQrCode(qrData);
            } catch (err) {
                console.error('Error:', err);
                setError(err.message || 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white text-gray-900">
                <div className="text-center p-6">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-4 text-lg">Loading your information...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white text-gray-900">
                <div className="text-center p-6">
                    <p className="text-red-600 text-xl">{`Error: ${error}`}</p>
                    <p className="mt-2">Please try again later.</p>
                </div>
            </div>
        );
    }

    return (
        <>
        <Navbar/>
        
        <div className="min-h-[90%] flex items-center justify-center bg-white p-6">
            <div className="w-full max-w-md bg-white shadow-xl rounded-lg p-8 border border-gray-200">
                <h1 className="text-3xl font-semibold text-center text-gray-900 mb-8">User Information</h1>

                {userInfo && (
                    <div className="space-y-4">
                        <div className="text-sm font-medium text-gray-600">
                            <p><strong>Name:</strong> {userInfo.name}</p>
                            <p><strong>Email:</strong> {userInfo.email}</p>
                            <p><strong>Position:</strong> {userInfo.position}</p>
                        </div>

                        {/* Generate and display QR Code */}
                        <div className="mt-6 text-center">
                            {qrCode && <img src={qrCode} alt="Generated QR Code" className="mx-auto" />}
                        </div>
                    </div>
                )}
            </div>
        </div>
        </>
    );
};

export default QrCodeGenerator;
