import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import { useAlertStore } from '@/stores/alert';
import { useRouter } from 'vue-router';

const router = useRouter(); // Gunakan Vue Router

// Buat instance Axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Sesuaikan dengan backend
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Menambahkan Token ke Setiap Request
api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    if (authStore.user?.token) {
      config.headers.Authorization = `Bearer ${authStore.user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Menangani Error & Auto-Logout
api.interceptors.response.use(
  (response) => response, // Jika sukses, langsung lanjutkan response
  (error) => {
    const authStore = useAuthStore();
    const alertStore = useAlertStore();

    if (error.response) {
      const { status } = error.response;

      if (status === 401 || status === 403) {
        authStore.logout(); // Auto logout jika token invalid/expired
        router.push('/login'); // Redirect ke halaman login
        alertStore.showAlert('Token Invalid, silahkan login kembali.', 'error');
      }
      alertStore.showAlert(error.response.data?.message || 'Terjadi kesalahan.', 'error');
    } else {
      alertStore.showAlert('Gagal terhubung ke server.', 'error');
    }
    return Promise.reject(error);
  }
);

export default api;