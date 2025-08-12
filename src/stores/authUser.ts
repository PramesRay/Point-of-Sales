import { defineStore } from 'pinia';
import api from '@/services/api';
import dummyUser from '@/services/common/user/dummyUser';

import type { CreateUser, UpdateUser, User } from '@/types/user';

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    me: (() => {
      const userStr = localStorage.getItem('user');
      try {
        return userStr ? JSON.parse(userStr) as User : null;
      } catch {
        return null;
      }
    })(),
    loading: false,
  }),
  actions: {
    async createMe(payload: CreateUser) {
      this.loading = true;
      try {
        const user = await api.post('/users', { payload });
        this.me = user.data;
        // localStorage.setItem('user', JSON.stringify(this.me));
      } catch (error: any) {
        console.error("Failed to fetch user data:", error);

        // delete section ====================================
        this.me = dummyUser[0];
        localStorage.setItem('user', JSON.stringify(this.me));
        // delete section ====================================

        throw new Error("Gagal membuat user baru, menggunakan dummy user");
      } finally {
        this.loading = false;
      }
    },

    async updateMe(payload: UpdateUser) {
      this.loading = true;
      try {
        const res = await api.put(`/users/${payload.id}`, payload);
        this.me = res.data;
        // localStorage.setItem('user', JSON.stringify(this.me));
      } catch (error: any) {
        console.error("Failed to update user data:", error);
        this.me = dummyUser[0]; // Fallback to dummy user
        // delete section ====================================
        localStorage.setItem('user', JSON.stringify(this.me));
        // delete section ====================================
        throw new Error("Gagal memperbarui user");
      } finally {
        this.loading = false;
      }
    }
  }
});
