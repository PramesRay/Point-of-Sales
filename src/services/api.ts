import axios from 'axios';
import { useAlertStore } from '@/stores/alert';

import { useRouter } from 'vue-router';
const router = useRouter(); // Gunakan Vue Router

// Buat instance Axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    useAlertStore().showAlert(
      error.response?.data?.message || 'Terjadi kesalahan.',
      'error'
    );
    return Promise.reject(error);
  }
);

export default api;