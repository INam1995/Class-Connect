import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    course: "",
    college: "",
    latitude: null,
    longitude: null,
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Fetch user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prevData) => ({
            ...prevData,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }));
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Location access denied. Please enable location to continue.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let validationErrors = {};
    if (!formData.name) validationErrors.name = "Name is required.";
    if (!formData.username) validationErrors.username = "Username is required.";
    if (!formData.email.includes("@")) validationErrors.email = "Please enter a valid email.";
    if (formData.password.length < 8) validationErrors.password = "Password must be at least 8 characters long.";
    if (!formData.course) validationErrors.course = "Course/Degree is required.";
    if (!formData.college) validationErrors.college = "College name is required.";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      try {
        const response = await fetch("http://localhost:5000/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          alert("Registration successful!");
          setFormData({
            name: "",
            username: "",
            email: "",
            password: "",
            course: "",
            college: "",
            latitude: null,
            longitude: null,
          });
          navigate("/login", { replace: true });
          setErrors({});
        } else {
          const errorData = await response.json();
          alert(`Error: ${errorData.message}`);
        }
      } catch (error) {
        console.error("Error during registration:", error);
        alert("Error during registration");
      }
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "50px auto", padding: "20px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", borderRadius: "10px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Register</h2>
      <form onSubmit={handleSubmit}>
        {/* Form Fields */}
        <div style={{ marginBottom: "15px" }}>
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your name" style={{ width: "100%", padding: "10px", marginTop: "5px", borderRadius: "5px" }} />
          {errors.name && <p style={{ color: "red", fontSize: "14px" }}>{errors.name}</p>}
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Username:</label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Enter a unique username" style={{ width: "100%", padding: "10px", marginTop: "5px", borderRadius: "5px" }} />
          {errors.username && <p style={{ color: "red", fontSize: "14px" }}>{errors.username}</p>}
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" style={{ width: "100%", padding: "10px", marginTop: "5px", borderRadius: "5px" }} />
          {errors.email && <p style={{ color: "red", fontSize: "14px" }}>{errors.email}</p>}
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" style={{ width: "100%", padding: "10px", marginTop: "5px", borderRadius: "5px" }} />
          {errors.password && <p style={{ color: "red", fontSize: "14px" }}>{errors.password}</p>}
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Course/Degree:</label>
          <input type="text" name="course" value={formData.course} onChange={handleChange} placeholder="Enter your course or degree" style={{ width: "100%", padding: "10px", marginTop: "5px", borderRadius: "5px" }} />
          {errors.course && <p style={{ color: "red", fontSize: "14px" }}>{errors.course}</p>}
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>College Name:</label>
          <input type="text" name="college" value={formData.college} onChange={handleChange} placeholder="Enter your college name" style={{ width: "100%", padding: "10px", marginTop: "5px", borderRadius: "5px" }} />
          {errors.college && <p style={{ color: "red", fontSize: "14px" }}>{errors.college}</p>}
        </div>

        {/* Hidden Fields for Latitude and Longitude */}
        <input type="hidden" name="latitude" value={formData.latitude || ""} />
        <input type="hidden" name="longitude" value={formData.longitude || ""} />

        {/* Submit Button */}
        <button type="submit" style={{ width: "45%", padding: "10px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", marginRight: "10px" }}>
          Register
        </button>

        {/* Already Registered Button */}
        <button type="button" onClick={() => navigate("/login", { replace: true })} style={{ width: "45%", padding: "10px", backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
          Already Registered? Login
        </button>
      </form>
    </div>
  );
};

export default Register;
