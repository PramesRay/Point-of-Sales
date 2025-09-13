import { defineStore } from 'pinia';
import api from '@/services/api';
import { dummyUser } from '@/services/common/user/dummyUser';
import type { Employee, UserRole } from '@/types/employee';
import type { Shift } from '@/types/shift';
import { dummyShiftEmployee } from '@/services/shift/dummyShiftEmployee';
import { auth } from '@/plugins/firebase';
import { router } from '@/router';

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    me: null as Employee | null,
    shift: null as Shift | null,
    loading: false,
  }),
  actions: {
    async fetchMe() {
      this.loading = true;
      try {
        const user = auth.currentUser;
        if (!user) throw new Error('Pengguna belum login');

        const response = await api.get('/employee/me');
        // if (response.data.data.role == null) {
        //   await signOut(auth); // Logout paksa
        //   throw new Error('Email belum dikonfirmasi oleh pemilik');
        // }
        this.me = response.data.data;
      } catch (error: any) {
        // this.me = dummyUser
        console.error("Failed to fetch user data:", error);
        router.push('/login');
      } finally {
        this.loading = false;
      }
    },

    async fetchShift() {
      this.loading = true;
      try {
        const response = await api.get('/shifts/me');
        this.shift = response.data;
      } catch (error: any) {
        console.error("Failed to fetch shift data:", error);
        // using dummy data for temporary solution
        this.shift = dummyShiftEmployee.find(shift => shift.meta.created_by.id === this.me?.id) ?? null
        console.log('shift', this.shift)
      } finally {
        this.loading = false;
      }
    },

    setNull() {
      this.me = null;
      this.shift = null;
    },

    hasRole(role: UserRole | UserRole[]): boolean {
      if (Array.isArray(role)) {
        return role.some(r => this.me?.role === r);
      }
      
      return this.me?.role === role;
    },
  }
});
