import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./Pages/Home"
import Register from './Components/Register';
import Dashboard from './Components/Dashboard';

// import Home from '@/pages/Home.jsx';

function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/register" element={<Register />} /> 
        <Route path="/dashboard" element={<Dashboard />} /> 
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
