import { ref, watchEffect } from 'vue'
import { fetchEmployeeActive } from '@/services/employeeActive/employeeActiveService'
import type { EmployeeActive } from '@/types/employeeActive'

export function useEmployeeActive() {
  const data = ref<EmployeeActive[]>([]);
  const loading = ref<boolean>(false);

  async function load({ filter }: { filter?: Record<string, any> } = {}) {
    try {
      loading.value = true;
      data.value = await fetchEmployeeActive(filter);
    } catch (e: any) {
      throw e
    } finally {
      loading.value = false;
    }
  }

  return {
    data,
    loading,
    load,
  };
}