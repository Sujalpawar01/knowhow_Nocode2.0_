'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

const ServiceFormPage = (req) => {
    const searchParams = useSearchParams();
    const regiserid = searchParams.get('id');
    

    const [formData, setFormData] = useState({
        service: '',
        doneDate: '',
        status: '',
        registerid: regiserid, // Ensure spelling matches backend
    });
    

    const router = useRouter();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async () => {
        if (!formData.service || !formData.doneDate || !formData.status || !formData.registerid) {
            alert('Please fill in all fields.');
            return;
        }

        console.log(formData, regiserid);

        try {
            const response = await fetch('/api/auth/make-application', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (response.ok) {
                alert('Service details submitted successfully!');
                router.push(`/officer/applications`); // Redirect to services list or another page
            } else {
                alert(`Error: ${result.error}`);
            }
        } catch (error) {
            console.error('Submission error:', error);
            alert('Something went wrong!');
        }
    };

    return (
        <div className="main h-screen w-full relative bg-gray-100 pt-10">
            <div className="container shadow-xl border rounded-xl h-[70%] justify-center w-1/2 p-3 px-6 py-6 bg-white mx-auto flex flex-col">
                <h1 className="font-bold text-2xl mb-8 mx-auto text-center mt-4">Service Form</h1>

                <label className="text-xl px-6 mb-2">Service</label>
                <input
                    type="text"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    placeholder="Enter the service name"
                    className="p-2 mx-auto w-11/12 mb-6 border border-gray-600 rounded-md"
                />

                <label className="text-xl px-6 mb-2">Done Date</label>
                <input
                    type="date"
                    name="doneDate"
                    value={formData.doneDate}
                    onChange={handleChange}
                    className="p-2 mx-auto w-11/12 mb-6 border border-gray-600 rounded-md"
                />

                <label className="text-xl px-6 mb-2">Status</label>
                <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="p-2 mx-auto w-11/12 mb-6 border border-gray-600 rounded-md"
                >
                    <option value="">Select Status</option>
                    <option value="Under A">Under A</option>
                    <option value="Under B">Under B</option>
                    <option value="Under C">Under C</option>
                    <option value="Cancelled">Cancelled</option>
                </select>

                <button
                    type="button"
                    onClick={handleSubmit}
                    className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 mt-5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 w-11/12 mx-auto"
                >
                    Submit
                </button>
            </div>
        </div>
    );
};

export default ServiceFormPage;
