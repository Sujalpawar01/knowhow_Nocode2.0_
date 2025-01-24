'use client';

import { useState, useEffect } from 'react';
import QRCode from 'qrcode';

const QrCodeGenerator = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [qrCode, setQrCode] = useState('');
    const [uniqueKey, setUniqueKey] = useState(Date.now()); // A unique key tied to each QR code

    const generateQrCode = async () => {
        try {
            const data = `Name: ${name}\nEmail: ${email}\nKey: ${uniqueKey}`; // Add unique key
            const qr = await QRCode.toDataURL(data, { width: 300 });
            setQrCode(qr);
        } catch (error) {
            console.error('Error generating QR code:', error);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setUniqueKey(Date.now()); // Update the unique key every 2 seconds
            generateQrCode();
        }, 2000); // Update every 2 seconds

        return () => clearInterval(interval); // Clear the interval on component unmount
    }, [name, email]); // Re-run when name or email changes

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h1>QR Code Generator</h1>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                style={{ marginBottom: '10px', padding: '8px', width: '300px' }}
            />
            <br />
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                style={{ marginBottom: '10px', padding: '8px', width: '300px' }}
            />
            <br />
            <div style={{ marginTop: '20px' }}>
                {qrCode && <img src={qrCode} alt="Generated QR Code" />}
            </div>
        </div>
    );
};

export default QrCodeGenerator;
