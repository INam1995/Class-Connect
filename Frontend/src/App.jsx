import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./Pages/Home"
import Register from './Components/Register';
import Dashboard from './Components/Dashboard';
import AdminDashboard from "./Pages/AdminDashboard";
import Profile from "./Pages/profile";
import Folder from "./Components/Folder";
import Login from './Components/Login'
// import Home from '@/pages/Home.jsx';
// ProtectedRoute: Redirects to login if user is not authenticated
function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth();
  
  if (isLoggedIn === null) {
    // Avoid flashing by showing nothing until state is determined
    return null; 
  }

  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <>
    
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/register" element={<Register />} /> 
        <Route path="/dashboard" element={<Dashboard />} /> 
        <Route path="/folder/:folderId" element={<Folder/>} />
        <Route path="/admin" element={<AdminDashboard/>} />
        <Route path="/profile/:userId" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
      </Routes>
    
    </>
  )
}

export default App
