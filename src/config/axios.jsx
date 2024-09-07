import axios from 'axios';
import { BASE_URL } from './ApiConstants';

// Buat instance Axios dengan baseURL
const api = axios.create({
  baseURL: BASE_URL.development, // Ganti dengan base URL API Anda
  withCredentials: true, // Ini akan memastikan cookies dikirim bersama request
});

export default api;
