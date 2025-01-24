"use client";
import { useRouter } from "next/navigation.js";
import Navbar from "../components/Navbar.js";
import { useState, useEffect } from "react";

const Page = () => {
  const router = useRouter();
  const [approved, setApproved] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleNavigation = (path) => {
    router.push(path);
  };

  useEffect(() => {
    const app=async()=>{
    const res = await fetch("/api/auth/approved", {
      method: "GET", // Pass FormData directly
    });
    const data=await res.json();
    console.log("zzzzzzzzzzzzz",data.appro);       
    setApproved(data.appro);
  }
  app();
  
  }, [])



  return (
    <>
      <Navbar />
      <div className="hero w-full flex flex-col items-center mt-24 gap-8 px-8">
        <div className="title text-5xl flex flex-col w-full items-center font-bold text-center">
          <span className="text-gray-900">Welcome to</span>
          <span className="text-blue-600">Regional Transport Office</span>
        </div>
        <div className="desc text-gray-700 text-center max-w-2xl">
          Empowering seamless services for citizens and esteemed personnel. 
          Explore our platform for a smarter, more efficient experience.
        </div>
        {console.log("xxxxxxxxxx",approved)}
        
        {!approved && (
          <button
            type="button"
            onClick={() => handleNavigation("/army/register")}
            className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-blue-800 font-medium rounded-lg text-lg px-6 py-3"
          >
            Register as an Esteemed Citizen
          </button>
        )}
        
          <div className="buttons mt-12 flex flex-wrap justify-center gap-6">
            <button
              type="button"
              onClick={() => handleNavigation("/generate-qr")}
              className="text-white bg-gradient-to-br from-purple-500 to-pink-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-pink-800 font-medium rounded-lg text-lg px-6 py-3"
            >
              Generate QR
            </button>
            <button
              type="button"
              onClick={() => handleNavigation("/book")}
              className="text-white bg-gradient-to-br from-orange-400 to-red-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-orange-300 dark:focus:ring-red-800 font-medium rounded-lg text-lg px-6 py-3"
            >
              Book Appointment
            </button>
            <button
              type="button"
              onClick={() => handleNavigation("/applications")}
              className="text-white bg-gradient-to-br from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-blue-800 font-medium rounded-lg text-lg px-6 py-3"
            >
              Application Tracking
            </button>
          </div>
        
      </div>
    </>
  );
};

export default Page;