import {  Routes, Route } from 'react-router-dom';
import Home from "./Pages/Home"
import Register from './Components/Register';
import Login from './Components/Login'
import Folder from './Components/Folder';
import Dashboard from './Components/Dashboard';

function App() {
  return (
    <>
    
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/register" element={<Register />} /> 
        <Route path="/dashboard" element={<Dashboard />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/folder/:folderId" element={<Folder />} />
      </Routes>
    
    </>
  )
}

export default App
