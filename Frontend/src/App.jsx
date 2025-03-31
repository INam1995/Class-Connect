import {  Routes, Route } from 'react-router-dom';
import Home from "./Pages/Home"
import Register from './Components/Register';
import Login from './Components/Login'
import Folder from './Components/Folder';
import Dashboard from './Components/Dashboard';

import Discussion from './Components/Discussion';
import AllChats from './Components/AllChats';
import ChatRoom from './Components/chatRoom'; 
function App() {
  return (
    <>
    
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/register" element={<Register />} /> 
        <Route path="/dashboard" element={<Dashboard />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/folder/:folderId" element={<Folder />} />
        <Route path="/discussion" element={<Discussion />} />
        <Route path="/chats" element={<AllChats />} /> {/* Add this route */}
        <Route path="/chatroom/:folderId" element={<ChatRoom />} />
          

      </Routes>
    
    </>
  )
}

export default App
