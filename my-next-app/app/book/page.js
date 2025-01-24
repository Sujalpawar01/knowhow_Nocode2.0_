'use client';

import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useRouter } from 'next/navigation';

export default function AppointmentBooking() {
    const router = useRouter();
    const [registerid, setregisterid] = useState('');
    const [role, setrole] = useState("citizen");
    const [namer, setnamer] = useState("user");

    useEffect(() => {
        const checkAuth = async () => {
            const res = await fetch("/api/auth/verify-token2");
            if (!res.ok) {
                router.push("/login");
            } else {
                let data = await res.json();
                setregisterid(data.user.id);
                setrole(data.rolex);
                setnamer(data.namex);
            }
        };

        checkAuth();
    }, [router]);

    const [formData, setFormData] = useState({
        option: '',
        date: '',
        registerid: '',
        city: '',
    });

    const [minDate, setMinDate] = useState('');
    const cities = ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Kolhapur"];

    useEffect(() => {
        const today = new Date();
        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        setMinDate(formatDate(today)); // Set minimum date for the date picker
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedFormData = { ...formData, registerid: registerid, roler: role, name: namer };

        const res = await fetch("/api/auth/book-appointment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedFormData),
        });

        if (!res.ok) {
            alert("Something went wrong");
        } else {
            alert('Appointment booked successfully!');
        }
    };

    return (
        <>
            <Navbar/>
        <div className='min-h-screen bg-gray-50 flex justify-center items-center'>
            <div className="w-full max-w-lg p-8 bg-white shadow-xl rounded-lg">
                <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Book an Appointment</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Service Option Dropdown */}
                    <div>
                        <label htmlFor="option" className="block text-sm font-medium text-gray-700">
                            Select Service
                        </label>
                        <select
                            id="option"
                            name="option"
                            value={formData.option}
                            onChange={handleChange}
                            className="mt-1 block w-full h-12 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        >
                            <option value="" disabled>Choose an option</option>
                            <option value="license">License</option>
                            <option value="vehicle_registration">Vehicle Registration</option>
                            <option value="road_tax_payment">Road Tax Payment</option>
                            <option value="number_plate">Number Plate</option>
                        </select>
                    </div>

                    {/* City Selector */}
                    <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                            Select City
                        </label>
                        <select
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className="mt-1 block w-full h-12 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        >
                            <option value="" disabled>Choose a city</option>
                            {cities.map((city) => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                    </div>

                    {/* Date Picker */}
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                            Select Date
                        </label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            min={minDate}
                            className="mt-1 block w-full h-12 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300"
                    >
                        Book Appointment
                    </button>
                </form>
            </div>
        </div>
        </>
    );
}
