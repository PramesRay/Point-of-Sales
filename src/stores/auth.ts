import { defineStore } from 'pinia';
import { router } from '@/router';
import api from '@/services/api'; // Menggunakan Axios dengan interceptor

const baseUrl = `${import.meta.env.VITE_API_URL}/users`;

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || 'null') as any,
    returnUrl: null as string | null
  }),
  actions: {
    async login(username: string, password: string) {
      try {
        /* ✅ ===(Gunakan ketika service backend sudah ada)===
        const response = await api.post(`${baseUrl}/authenticate`, { username, password });

        // Update state dengan data user
        this.user = response.data;
        
        // Simpan user & token di local storage agar tetap login setelah refresh
        localStorage.setItem('user', JSON.stringify(response.data));
        */

        // ❌ Hardcode data user sementara (tanpa request ke server)
        const mockUser = {
          id: 1,
          username,
          token: 'mocked-jwt-token'
        };

        // Simpan user ke state & localStorage
        this.user = mockUser;
        localStorage.setItem('user', JSON.stringify(mockUser));

        // Redirect ke halaman tujuan atau dashboard
        router.push(this.returnUrl || '/dashboard/default');
      } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Login gagal');
      }
    },
    logout() {
      this.user = null;
      localStorage.removeItem('user');
      router.push('/login');
    }
  }
});
