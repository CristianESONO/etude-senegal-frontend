// src/config/api.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD 
    ? 'https://etude-senegal-backend.onrender.com'
    : 'http://localhost:5000');

export { API_BASE_URL };