import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext"; // ✅ Ensure correct import path

import Dashboard from "./Dashboard";
const Login = () => {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ Get login function from AuthContext

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!emailOrUsername || !password) {
      setError("Both email/username and password are required.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailOrUsername, username: emailOrUsername, password }),
        credentials: "include",
      });

      const data = await response.json();
      console.log("Server Response:", data); // Debugging
      console.log(data.user)

      if (response.ok) {
        if (!data.token || !data.user) {
          setError("Invalid response from server. Please try again.");
          return;
        }

        login(data.user, data.token); // ✅ Store user & token globally
        // alert("Login successful!");
        navigate("/dashboard", {replace:true}); // ✅ Redirect to profile
      } else {
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="bg-white p-4 rounded shadow-lg w-100" style={{ maxWidth: "400px" }}>
        <h2 className="text-center text-primary">Log in</h2>
        {error && <p className="text-danger text-center">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <input
              type="text"
              placeholder="Email or Username"
              className="form-control"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              placeholder="Password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Log in
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
