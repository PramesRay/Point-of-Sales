import { defineStore } from 'pinia';
import api from '@/services/api';

import type { CreateUser, UpdateUser, User } from '@/types/user';

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    me: (() => {
      const userStr = localStorage.getItem('user-nurchs');
      return userStr ? JSON.parse(userStr) as User : null;
    })(),
    loading: false,
  }),
  actions: {
    setMe(user: User) {
      this.me = user;
      localStorage.setItem('user-nurchs', JSON.stringify(user));
    },
    async getMe(id: string) {
      this.loading = true;
      try {
        const res = await api.get(`/customer/${id}`);
        return res.data;
      } catch (error: any) {
        console.error("Failed to fetch user data:", error);
        return null;
      } finally {
        this.loading = false;
      }
    },
    async createMe(payload: CreateUser) {
      this.loading = true;
      try {
        const res = await api.post('/customer', payload);
        return res.data;
      } catch (error: any) {
        console.error("Failed to fetch user data:", error);
        throw new Error("Gagal membuat user baru, menggunakan dummy user");
      } finally {
        this.loading = false;
      }
    },

    async updateMe(payload: UpdateUser) {
      this.loading = true;
      try {
        const res = await api.put(`/customer/${payload.id}`, payload);
        return res.data;
      } catch (error: any) {
        console.error("Failed to update user data:", error);
        throw new Error("Gagal memperbarui user");
      } finally {
        this.loading = false;
      }
    }
  }
});
