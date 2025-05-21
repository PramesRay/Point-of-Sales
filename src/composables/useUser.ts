import api from '@/services/api';
import { fetchUser } from '@/services/common/user/userService';
import type { Employee } from '@/types/employee';
import { ref } from 'vue';

export function useUser() {
  const data      = ref<Employee>();
  const loading   = ref<boolean>(false);
  
  async function fetchMe() {
    try {
      loading.value = true
      data.value = await fetchUser()
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    data,
    loading,
    fetchMe,
  };
}
