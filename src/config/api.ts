// src/config/api.ts
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://etude-senegal-backend.onrender.com'  // URL Render en production
  : 'http://localhost:5000';                      // Local en développement

export { API_BASE_URL };