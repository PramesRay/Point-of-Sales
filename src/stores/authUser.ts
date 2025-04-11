import { defineStore } from 'pinia';
import api from '@/services/api';
import { fetchWrapper } from '@/utils/helpers/fetch-wrapper';

export const useUsersStore = defineStore({
  id: 'Authuser',
  state: () => ({
    users: {}
  }),
  actions: {
    async getAll() {
      this.users = { loading: true };
      try {
        const response = await api.get('/users');
        this.users = response.data;
      } catch (error: any) {
        this.users = { error: error.message || 'Gagal mengambil data pengguna' };
      }
    }
  }
});
