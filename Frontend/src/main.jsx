import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from "./Components/AuthContext.jsx"; // ✅ Ensure correct path
import { BrowserRouter as Router } from "react-router-dom"; // ✅ Import BrowserRouter

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router> 
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  </StrictMode>
);
