'use client'
import React, { useState } from 'react';
import Navbar from '@/app/components/Navbar.js';
import { useRouter } from 'next/navigation';

const page = () => {
  const [formdata, setformdata] = useState({
    position: '',
    aadharCardNo: '',
    defenceIdNo: '',
    idCard: null,
  });

  const userapi = "http://localhost:5001/api/v1/user";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setformdata({ ...formdata, [name]: value });
  };

  const router=useRouter();

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setformdata({ ...formdata, [name]: files[0] });
  };

  const handleSubmit = async () => {
    const formData = new FormData();
  
    formData.append("position", formdata.position);
    formData.append("aadharCardNo", formdata.aadharCardNo);
    formData.append("defenceIdNo", formdata.defenceIdNo);
    formData.append("idCard", formdata.idCard);
  
    try {
      const response = await fetch("/api/auth/armyregister", {
        method: "POST",
        body: formData, // Pass FormData directly
      });
  
      const result = await response.json();
  
      if (response.ok) {
        alert("Registration successful!");
        router.push('/home');
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Something went wrong!");
    }
  };
  
  

  return (
    <>
      <Navbar />
      <div className="main h-screen w-full relative bg-white pt-10">
        <div className="container shadow-xl border rounded-xl h-[82%] justify-center w-1/2 p-3 px-6 py-6 bg-white mx-auto flex flex-col">
          <h1 className="font-bold text-2xl mb-8 mx-auto text-center mt-4">Register as Army</h1>

          <label className="text-xl px-6 mb-2">Position</label>
          <select
            name="position"
            value={formdata.position}
            onChange={handleChange}
            className="p-2 mx-auto w-11/12 mb-6 border border-gray-600 rounded-md"
          >
            <option value="">Select Position</option>
            <option value="Military Personnel">Military Personnel</option>
            <option value="Jawan">Jawan</option>
            <option value="Veteran">Veteran</option>
          </select>

          <label className="text-xl px-6 mb-2">Aadhar Card No</label>
          <input
            type="text"
            name="aadharCardNo"
            value={formdata.aadharCardNo}
            onChange={handleChange}
            className="p-2 mx-auto w-11/12 mb-6 border border-gray-600 rounded-md"
          />

          <label className="text-xl px-6 mb-2">Defence ID No</label>
          <input
            type="text"
            name="defenceIdNo"
            value={formdata.defenceIdNo}
            onChange={handleChange}
            className="p-2 mx-auto w-11/12 mb-6 border border-gray-600 rounded-md"
          />

          <label className="text-xl px-6 mb-2">ID Card (PDF)</label>
          <input
            type="file"
            name="idCard"
            accept="application/pdf"
            onChange={handleFileChange}
            className="p-2 mx-auto w-11/12 mb-6 border border-gray-600 rounded-md"
          />

          <button
            type="button"
            onClick={handleSubmit}
            className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 mt-5 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 w-11/12 mx-auto ml-7"
          >
            Register
          </button>

          <p className="size-8 w-64 mb-4">
            Already a user?<span className="text-blue-600"> Login</span>
          </p>
        </div>
      </div>
    </>
  );
};

export default page;
