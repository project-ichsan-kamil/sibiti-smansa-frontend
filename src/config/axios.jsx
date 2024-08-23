import axios from 'axios';

// Buat instance Axios dengan baseURL
const api = axios.create({
  baseURL: 'http://localhost:3001/api', // Ganti dengan base URL API Anda
  withCredentials: true, // Ini akan memastikan cookies dikirim bersama request
});

export default api;
