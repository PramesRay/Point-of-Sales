import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import { useAlertStore } from '@/stores/alert';
import { auth } from '@/plugins/firebase';

import { useRouter } from 'vue-router';
const router = useRouter(); // Gunakan Vue Router

// Simpan promise refresh global agar request lain NUNGGU promise yg sama (anti-dupe)
let refreshPromise: Promise<string | null> | null = null;

// Ambil token tanpa paksa (untuk request awal)
export async function getIdTokenSoft(): Promise<string | null> {
  try {
    return await auth.currentUser?.getIdToken() ?? null; // no force
  } catch {
    return null;
  }
}

// Paksa refresh SEKALI untuk seluruh request yg nabrak 401/403 bersamaan
export async function getIdTokenHardOnce(): Promise<string | null> {
  if (!auth.currentUser) return null;

  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        await auth.currentUser!.getIdToken(true); // force
        return await auth.currentUser!.getIdToken(); // ambil yg baru
      } finally {
        // Pastikan reset meski gagal
        const tmp = refreshPromise;
        // Delay microtask agar request yang sudah menunggu bisa ambil nilai terlebih dulu
        setTimeout(() => { if (refreshPromise === tmp) refreshPromise = null; }, 0);
      }
    })();
  }
  return refreshPromise;
}

// Buat instance Axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Sesuaikan dengan backend
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Menambahkan Token ke Setiap Request
api.interceptors.request.use(async (config) => {
  const token = await getIdTokenSoft();
  if (token) {
    config.headers = config.headers ?? {};
    if (!config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});


// Response Interceptor: Menangani Error & Auto-Logout
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const authStore = useAuthStore();
//     const alertStore = useAlertStore();

//     const originalConfig = error.config as typeof error.config & { _retry?: boolean };

//     // Tidak ada response (timeout / jaringan)
//     if (!error.response) {
//       alertStore.showAlert('Gagal terhubung ke server.', 'error');
//       return Promise.reject(error);
//     }

//     const status = error.response.status;

//     // Hanya handle 401/403 dan pastikan belum pernah di-retry
//     if ((status === 401 || status === 403) && !originalConfig?._retry) {
//       // Hindari refresh utk endpoint tertentu jika perlu
//       // if (originalConfig.url?.includes('/auth/logout')) return Promise.reject(error);

//       // Paksa refresh SEKALI (single-flight)
//       const fresh = await getIdTokenHardOnce();

//       // Kalau sukses dapat token dan masih ada user → retry sekali
//       if (fresh && auth.currentUser) {
//         originalConfig._retry = true;
//         originalConfig.headers = originalConfig.headers ?? {};
//         originalConfig.headers.Authorization = `Bearer ${fresh}`;
//         return api.request(originalConfig);
//       }

//       // Gagal refresh atau user sudah hilang → logout
//       await authStore.logout();
//       router.push('/login');
//       alertStore.showAlert('Sesi berakhir. Silakan login kembali.', 'error');
//       return Promise.reject(error);
//     }

//     // Bukan 401/403 → teruskan error normal
//     alertStore.showAlert(error.response.data?.message || 'Terjadi kesalahan.', 'error');
//     return Promise.reject(error);
//   }
// );

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    if (status === 401 || status === 403) {
      await useAuthStore().logout();
      router.push('/login');
      useAlertStore().showAlert('Sesi kadaluarsa. Silakan login kembali.', 'error');
    } else {
      useAlertStore().showAlert(
        error.response?.data?.message || 'Terjadi kesalahan.',
        'error'
      );
    }
    return Promise.reject(error);
  }
);


export default api;