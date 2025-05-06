//api.js

import axios from "axios";

// const instance = axios.create({
//   baseURL: "http://localhost:5000", 
// });

const instance = axios.create({
  baseURL: "/api", // Let Vite proxy handle this
});

export default instance;


