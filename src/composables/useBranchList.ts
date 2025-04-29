import { ref, onMounted } from 'vue';
import { fetchBranchList } from '@/services/common/branchService';
import type { Branch } from '@/types/branch';

// Composable untuk mengambil list cabang (berdasarkan hak akses user)
export function useBranchList() {
  const branches = ref<Branch[]>([]);
  const loading = ref<boolean>(true);
  const error = ref<Error | null>(null);

  async function load() {
    loading.value = true;
    try {
      branches.value = await fetchBranchList();
    } catch (err: any) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  }

  onMounted(load);
  return { branches, loading, error, reload: load };
}