import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);  // ✅ Add a loading state

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    } else {
      setUser(null);
      setIsLoggedIn(false);
    }

    setLoading(false);  // ✅ Finish loading once local storage check is done
  }, []);

  const login = (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    setUser(userData);
    setIsLoggedIn(true);
  };

  const logout = async () => {
    try {
      
     const token = localStorage.getItem("token"); // ✅ Get token from storage
     if (!token) {
      // console.error("No token found in localStorage");
      return;
     }
    //  console.log("token ", token);
      const response = await axios.post(
        "http://localhost:5000/api/auth/logout",
        {}, 
        { 
          withCredentials: true, 
          headers: { Authorization: `Bearer ${token}` } // Send token in headers
        }
      );
      console.log("token   ". token)
  
      console.log("Logout Response:", response);
      
      localStorage.removeItem("token");
      localStorage.removeItem("user"); 
      setUser(null);
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Logout failed", error.response?.data || error.message);
      window.location.href = '/login';
    }
  };

  if (loading) {
    return <div>Loading...</div>;  // ✅ Prevent rendering before loading is done
  }

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
