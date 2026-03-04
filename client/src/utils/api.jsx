import axios from "axios";


const API = axios.create({
  baseURL: "https://expenses-app-2vb4.onrender.com",
  // baseURL: "http://localhost:5000",
  
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = token;
  }
  return req;
});

export default API;