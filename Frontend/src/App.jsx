import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Dashboard from './Components/Dashboard';


import Home from "./Pages/Home"
import Register from './Components/Register';
import Login from './Components/Login'


function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/register" element={<Register />} /> 

        <Route path="/dashboard" element={<Dashboard />} /> 

        <Route path="/login" element={<Login />} />

      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
