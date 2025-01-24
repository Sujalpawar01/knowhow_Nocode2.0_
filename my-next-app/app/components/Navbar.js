"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [registerid, setRegisterId] = useState("1");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/verify-token");
      if (!res.ok) {
        // router.push("/login");
      } else {
        const data = await res.json();
        setRegisterId(data.user.id); // Set the register ID based on the response
        console.log(data.user.id, "User ID fetched"); // Debug log for fetched user ID
      }
    } catch (error) {
      console.error("Authentication check failed", error);
    }
  };

  
  const signout= async()=>{
    const res = await fetch("/api/auth/signout",{
      method:"POST"
    })
    router.push('/login')
  }

  useEffect(() => {
    checkAuth(); // Check authentication when the component mounts
  }, []);

  return (
    <nav className="w-full p-5 flex justify-between px-28">
      <div className="con text-2xl font-bold">
        <span>R</span>
        <span className="text-red-500">T</span>
        <span>O</span>
      </div>
      <ul className="flex text-lg gap-4 items-center">
        <li className="cursor-pointer" onClick={()=>router.push('/home')}>Home</li>
        <li  className="cursor-pointer">About Us</li>
        {registerid === "1" && <li onClick={() => router.push("/login")}>Login</li>}
        {registerid !== "1" && (
          <li>
            <button
              id="dropdownDefaultButton"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
            >
              Options
              <svg
                className="w-2.5 h-2.5 ml-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 4 4 4-4"
                />
              </svg>
            </button>

            {dropdownOpen && (
              <div
                id="dropdown"
                className="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 absolute"
              >
                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                  <li>
                    <a
                      href="/generate-qr"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Generate QR
                    </a>
                  </li>
                  <li>
                    <a
                      href="/book"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Book Appointment
                    </a>
                  </li>
                  <li>
                    <a
                      href="/appointments"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Appointments
                    </a>
                  </li>
                  <li>
                    <a
                      href="/army/register"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Update Profile
                    </a>
                  </li>
                  <li>
                    <a
                      onClick={()=>signout()}
                      className="block px-4 py-2 hover:bg-gray-100 curor-pointer dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Sign out
                    </a>
                  </li>
                </ul>
              </div>
            )}
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
