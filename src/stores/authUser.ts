import { defineStore } from 'pinia';
import api from '@/services/api';
import { dummyUser } from '@/services/common/user/dummyUser';
import type { AccessKey, Employee, UserRole } from '@/types/employee';
import type { Shift, ShiftCashier, ShiftKitchen } from '@/types/shift';
import { dummyShiftCashier } from '@/services/shift/dummyShiftCashier';
import { dummyShiftKitchen } from '@/services/shift/dummyShiftKitchen';
import { dummyShiftEmployee } from '@/services/shift/dummyShiftEmployee';
import { auth } from '@/plugins/firebase';

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
        
        await user.getIdToken(true);

        // const response = await api.get('/employee/me');
        // this.me = response.data;
        this.me = dummyUser // hapus nanti
      } catch (error: any) {
        console.error("Failed to fetch user data:", error);
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

    hasRole(role: UserRole | UserRole[]): boolean {
      if (Array.isArray(role)) {
        return role.some(r => this.me?.role === r);
      }
      
      return this.me?.role === role;
    },
    hasAccess(keys: AccessKey[]): boolean {
      return keys.some(key => this.me?.access?.includes(key));
    }
  }
});
