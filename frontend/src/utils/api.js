// src/utils/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "/api", 
  headers: { "Content-Type": "application/json" },
});

export default api;