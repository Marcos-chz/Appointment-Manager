// src/config.js
const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:4000' 
  : 'https://appointment-manager-oenl.onrender.com';

export default API_URL;