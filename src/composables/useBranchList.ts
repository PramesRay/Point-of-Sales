import { ref } from 'vue';
import { fetchBranches } from '@/services/common/branch/branchService';
import type { Branch } from '@/types/branch';

// Composable untuk mengambil list cabang (berdasarkan hak akses user)
export function useBranchList() {
  const data = ref<Branch[]>([]);
  const loading = ref<boolean>(false);
  const error = ref<Error | null>(null);

  async function load() {
    loading.value = true;
    error.value   = null;
    try {
      data.value = await fetchBranches();
    } catch (e: any) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  }

  return {
    load,
    data,
    loading,
    error 
  };
}