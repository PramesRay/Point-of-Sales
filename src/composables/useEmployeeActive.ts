import { ref, watchEffect } from 'vue'
import { fetchBranchList } from '@/services/common/branch/branchService'
import { fetchEmployeeActive } from '@/services/employeeActive/employeeActiveService'
import type { EmployeeActive } from '@/types/employeeActive'
import type { Branch } from '@/types/branch'
import { useRoute } from 'vue-router'

export function useEmployeeActive() {
  const route     = useRoute();
  const branchId  = ref<string>(String(route.query.branch || 'all'));
  const data = ref<EmployeeActive[]>([]);
  const loading = ref<boolean>(false);

  async function load(id: string) {
    try {
      loading.value = true;
      data.value = await fetchEmployeeActive(id);
    } catch (e: any) {
      throw e
    } finally {
      loading.value = false;
    }
  }

  // Watch fetch Employee Active Data when branch changes
  watchEffect(() => {
    const id = String(route.query.branch || 'all');
    branchId.value = id;
    load(id);
  });

  return {
    data,
    loading,
    load,
  };
}