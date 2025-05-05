import { Routes, Route, Navigate } from 'react-router-dom';
import Home from "./Pages/Home";
import Register from './Pages/Register.jsx';
import Dashboard from './Pages/Dashboard.jsx';
import AdminDashboard from "./Pages/AdminDashboard.jsx";
import Profile from "./Pages/profile.jsx";
import Folder from "./Pages/Folder.jsx";
import Login from './Pages/Login.jsx';
import AllChats from './Components/ChatComponents/AllChats.jsx';
import ChatRoom from './Components/ChatComponents/ChatRoom.jsx';
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
        <Route path="/chats" element={<AllChats />} /> {/* Add this route */}
        <Route path="/chatroom/:folderId" element={<ChatRoom />} />
          
      </Routes>
    
    </>
  )
}

export default App
