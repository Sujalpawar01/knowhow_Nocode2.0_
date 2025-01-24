// "use client";
// import { useRouter } from "next/navigation.js";
// import Navbar from "../components/Navbar.js";
// import { useState, useEffect } from "react";

// const Page = () => {
//   const router = useRouter();
//   const [approved, setApproved] = useState(false);
//   const [loading, setLoading] = useState(true);

//   const handleNavigation = (path) => {
//     router.push(path);
//   };

//   useEffect(() => {
//     const app=async()=>{
//     const res = await fetch("/api/auth/approved", {
//       method: "GET", // Pass FormData directly
//     });
//     const data=await res.json();
//     console.log("zzzzzzzzzzzzz",data.appro);       
//     setApproved(data.appro);
//   }
//   app();
  
//   }, [])



//   return (
//     <>
//       <Navbar />
//       <div className="hero w-full flex flex-col items-center mt-24 gap-8 px-8">
//         <div className="title text-5xl flex flex-col w-full items-center font-bold text-center">
//           <span className="text-gray-900">Welcome to</span>
//           <span className="text-blue-600">Regional Transport Office</span>
//         </div>
//         <div className="desc text-gray-700 text-center max-w-2xl">
//           Empowering seamless services for citizens and esteemed personnel. 
//           Explore our platform for a smarter, more efficient experience.
//         </div>
//         {console.log("xxxxxxxxxx",approved)}
        
//         {!approved && (
//           <button
//             type="button"
//             onClick={() => handleNavigation("/army/register")}
//             className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-blue-800 font-medium rounded-lg text-lg px-6 py-3"
//           >
//             Register as an Esteemed Citizen
//           </button>
//         )}
        
//           <div className="buttons mt-12 flex flex-wrap justify-center gap-6">
//             <button
//               type="button"
//               onClick={() => handleNavigation("/generate-qr")}
//               className="text-white bg-gradient-to-br from-purple-500 to-pink-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-pink-800 font-medium rounded-lg text-lg px-6 py-3"
//             >
//               Generate QR
//             </button>
//             <button
//               type="button"
//               onClick={() => handleNavigation("/book")}
//               className="text-white bg-gradient-to-br from-orange-400 to-red-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-orange-300 dark:focus:ring-red-800 font-medium rounded-lg text-lg px-6 py-3"
//             >
//               Book Appointment
//             </button>
//             <button
//               type="button"
//               onClick={() => handleNavigation("/applications")}
//               className="text-white bg-gradient-to-br from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-blue-800 font-medium rounded-lg text-lg px-6 py-3"
//             >
//               Application Tracking
//             </button>
//           </div>
        
//       </div>
//     </>
//   );
// };

// export default Page;






"use client";

import { useRouter } from "next/navigation.js";
import Navbar from "../components/Navbar.js";
import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";

const Page = () => {
  const router = useRouter();
  const [approved, setApproved] = useState(false);
  const [loading, setLoading] = useState(true); // Added loading state
  const cardContainerRef = useRef(null);

  useEffect(() => {
    const fetchApprovalStatus = async () => {
      const res = await fetch("/api/auth/approved", {
        method: "GET",
      });
      const data = await res.json();
      setApproved(data.appro);
      setLoading(false); // Set loading to false when data is fetched
    };

    fetchApprovalStatus();

    // GSAP Horizontal Scrolling Animation
    const ctx = gsap.context(() => {
      gsap.to(".card", {
        xPercent: -100,
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: ".card-container",
          start: "center center",
          scrub: 1,
          pin: true,
          end: () => "+=" + cardContainerRef.current.offsetWidth,
        },
      });
    }, cardContainerRef);

    return () => ctx.revert();
  }, []);

  const handleNavigation = (path) => {
    router.push(path);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black text-white">
        <span className="text-xl">Loading...</span>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white">
      {/* Improved Navbar */}
      <Navbar />

      {/* Hero Section */}
      <div className="hero w-full flex flex-col items-center mt-24 gap-8 px-8">
        <div className="title text-5xl flex flex-col w-full items-center font-bold text-center">
          <span className="text-gray-300">Welcome to</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-green-400 to-purple-600">
            Regional Transport Office
          </span>
        </div>
        <div className="desc text-gray-400 text-center max-w-2xl text-lg">
          Empowering seamless services for citizens and esteemed personnel. 
          Explore our platform for a smarter, more efficient experience.
        </div>

        {!approved && (
          <button
            type="button"
            onClick={() => handleNavigation("/army/register")}
            className="bg-gradient-to-r from-green-400 to-blue-600 text-black font-semibold py-3 px-6 rounded-lg hover:scale-105 transform transition"
          >
            Register as an Esteemed Citizen
          </button>
        )}

        {/* Action Buttons */}
        <div className="buttons mt-12 flex flex-wrap justify-center gap-6">
          <button
            type="button"
            onClick={() => handleNavigation("/generate-qr")}
            className="bg-gradient-to-r from-purple-500 to-pink-600 text-black font-semibold py-3 px-6 rounded-lg hover:scale-105 transform transition"
          >
            Generate QR
          </button>
          <button
            type="button"
            onClick={() => handleNavigation("/book")}
            className="bg-gradient-to-r from-orange-400 to-red-500 text-black font-semibold py-3 px-6 rounded-lg hover:scale-105 transform transition"
          >
            Book Appointment
          </button>
          <button
            type="button"
            onClick={() => handleNavigation("/applications")}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-semibold py-3 px-6 rounded-lg hover:scale-105 transform transition"
          >
            Application Tracking
          </button>
        </div>
      </div>

      {/* Card Section with Horizontal Scrolling */}
      <div className="card-section mt-16 px-8 overflow-hidden">
        <h2 className="text-3xl font-bold text-center text-gray-300 mb-8">
          Explore Our Features
        </h2>
        <div
          className="card-container flex gap-6 "
          ref={cardContainerRef}
        >
          {[
            {
              title: "Quick QR Generation",
              desc: "Generate QR codes effortlessly for faster access to services and seamless sharing.",
              color: "bg-blue-500",
            },
            {
              title: "Appointment Booking",
              desc: "Book appointments with ease and save time with our optimized scheduling system.",
              color: "bg-green-500",
            },
            {
              title: "Track Your Applications",
              desc: "Monitor the status of your applications in real-time and stay informed.",
              color: "bg-purple-500",
            },
            {
              title: "User-Friendly Interface",
              desc: "Navigate through our platform with an intuitive and modern design for all users.",
              color: "bg-pink-500",
            },
            {
              title: "Secure Platform",
              desc: "Experience top-notch security to ensure your data is protected at all times.",
              color: "bg-orange-500",
            },
            {
              title: "24/7 Support",
              desc: "Our team is available around the clock to assist you with your queries.",
              color: "bg-cyan-500",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className={`card ${feature.color} text-black w-64 h-64 p-6 rounded-lg shadow-lg flex flex-col justify-between hover:scale-105 transform transition`}
            >
              <h3 className="text-xl font-bold text-white">{feature.title}</h3>
              <p className="text-gray-100">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Us Section in Rectangle Shape */}
      <div className="contact-us-section mt-16 px-8 py-10 bg-gray-800 rounded-none">
        <h2 className="text-3xl font-bold text-center text-gray-100 mb-8">Contact Us</h2>
        <div className="flex justify-center">
          <form
            className="w-full max-w-lg space-y-4"
            action="/api/contact" // API endpoint for submitting contact form
            method="POST"
          >
            <div>
              <label htmlFor="name" className="block text-gray-200">Your Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full p-3 rounded-lg bg-gray-500 text-white focus:outline-none"
                required
                aria-label="Name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-gray-100">Your Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full p-3 rounded-lg bg-gray-500 text-white focus:outline-none"
                required
                aria-label="Email"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-gray-100">Your Message</label>
              <textarea
                id="message"
                name="message"
                className="w-full p-3 rounded-lg bg-gray-500 text-white focus:outline-none"
                rows="5"
                required
                aria-label="Message"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-teal-500 to-blue-600 text-white py-3 px-6 rounded-lg hover:scale-105 transform transition"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;
