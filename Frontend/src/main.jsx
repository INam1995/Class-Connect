import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";  // ✅ Import Provider from react-redux
import store from "./app/store"; // ✅ Ensure correct path to your store
import { BrowserRouter as Router } from "react-router-dom"; 
import { AuthProvider } from "./Components/AuthContext.jsx"; 

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import "./index.css";
import App from "./App.jsx";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";

TimeAgo.addDefaultLocale(en); // ✅ Register the locale once

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>  {/* ✅ Fix: Add missing < */}
      <Router>
        <AuthProvider>  {/* ✅ Ensure AuthProvider is wrapped properly */}
          <App />
        </AuthProvider>
      </Router>
    </Provider>
  </StrictMode>
);
