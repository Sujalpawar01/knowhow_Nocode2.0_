// "use client";

// import React, { useState } from "react";
// import { useRouter } from "next/navigation";

// const Login = () => {
//   const [form, setForm] = useState({ email: "", password: "" });
//   const [error, setError] = useState("");
//   const router = useRouter();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     const res = await fetch("/api/auth/rto/login", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(form),
//     });

//     const data = await res.json();
//     if (!res.ok) {
//       setError(data.error);
//     } else {
//       router.push("/officer/appointments");
//     }
//   };

//   return (
//     <div className="flex justify-center items-center h-screen bg-gray-100">
//       <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
//         <h2 className="text-xl font-bold mb-4">Login</h2>
//         {error && <p className="text-red-500">{error}</p>}
//         <input
//           type="email"
//           placeholder="Email"
//           value={form.email}
//           onChange={(e) => setForm({ ...form, email: e.target.value })}
//           className="w-full p-2 border mb-3"
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={form.password}
//           onChange={(e) => setForm({ ...form, password: e.target.value })}
//           className="w-full p-2 border mb-3"
//         />
//     <button type="submit" className="bg-blue-500 text-white p-2 w-full mb-5">Login</button>
//       <a href="/rto/register" className="text-black">Create account ??</a>
//       </form>
//     </div>
//   );
// };

// export default Login;






"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/auth/rto/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
    } else {
      router.push("/officer/appointments");
    }
  };

  // GSAP Animation
  React.useEffect(() => {
    gsap.fromTo(".form-container", { opacity: 0, y: -30 }, { opacity: 1, y: 0, duration: 1 });
  }, []);

  return (
    <div className="flex justify-center items-center h-screen bg-black text-white">
      <form onSubmit={handleSubmit} className="form-container bg-white p-6 rounded-lg shadow-xl w-96">
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">Login</h2>

        {error && <p className="text-red-500 text-center mb-3">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full p-3 border-b-2 mb-4 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full p-3 border-b-2 mb-4 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />

        <button type="submit" className="w-full bg-gradient-to-r from-green-400 to-blue-600 text-white py-3 rounded-lg hover:bg-gradient-to-br transform transition">
          Login
        </button>

        <div className="text-center mt-4">
          <p className="text-gray-600">Don't have an account?</p>
          <a href="/rto/register" className="text-blue-500 hover:underline">Create one</a>
        </div>
      </form>
    </div>
  );
};

export default Login;
