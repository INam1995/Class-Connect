import React, { useState } from "react";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill out all fields.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        setError(data.message || "Login failed.");
        setEmail(""); 
        setPassword(""); 
      } else {
       
        setError("");
        console.log("Logged in successfully");
       
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
      setEmail(""); 
      setPassword(""); 
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-6">Welcome to the Page</h1>
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Log in</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Email"
            className="w-full px-4 py-3 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="mt-6">
          <button
            className="w-full px-4 py-3 text-lg font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-500"
            onClick={handleLogin}
          >
            Log in
          </button>
          {error && (
            <p className="text-red-500 text-sm text-center mt-3">{error}</p>
          )}
          <p className="text-sm text-center mt-3">
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;