import { BrowserRouter, Routes, Route } from 'react-router-dom';
<<<<<<< HEAD


import Dashboard from './Components/Dashboard';

=======
>>>>>>> cba06aa661f52ca1c4203105032ff093cd99aac0
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
