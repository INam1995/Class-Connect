import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext"; // Ensure correct import

const Login = () => {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const { login } = useAuth(); // Get login function from AuthContext
  const navigate = useNavigate();

  // Validate form before submission
  const validateForm = () => {
    let valid = true;
    setEmailError("");
    setPasswordError("");

    if (!emailOrUsername.trim()) {
      setEmailError("Email/Username is required.");
      valid = false;
    }

    if (!password.trim()) {
      setPasswordError("Password is required.");
      valid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      valid = false;
    }

    return valid;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;
    if (!emailOrUsername || !password) {
      setError("Both email/username and password are required.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailOrUsername.trim(), password: password.trim() }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed. Please try again.");
      }

      if (!data.token || !data.user || !data.user.role) {
        throw new Error("Invalid response from server. Please try again.");
      }

      // ✅ Store user & token globally
      login(data.user, data.token);

      // ✅ Redirect based on role
      if (["superadmin"].includes(data.user.role.toLowerCase())) {
        navigate("/admin", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError(error.message || "Something went wrong. Please try again later.");
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
              className={`form-control ${emailError ? "is-invalid" : ""}`}
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              required
            />
            {emailError && <div className="invalid-feedback">{emailError}</div>}
          </div>
          <div className="mb-3">
            <input
              type="password"
              placeholder="Password"
              className={`form-control ${passwordError ? "is-invalid" : ""}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {passwordError && <div className="invalid-feedback">{passwordError}</div>}
          </div>
          <button 
            type="submit" 
            className="btn btn-primary w-100"
            disabled={!emailOrUsername.trim() || !password.trim() || password.length < 6}
          >
            Log in
          </button>
        </form>

        {/* Create Account Link */}
        <div className="mt-3 text-center">
          <p>
            Don't have an account? <Link to="/register">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
