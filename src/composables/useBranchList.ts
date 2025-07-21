import { ref, onMounted } from 'vue';
import { createBranch, deleteBranch, fetchBranches, updateBranch } from '@/services/common/branch/branchService';
import type { Branch, CreateBranchPayload, UpdateBranchPayload } from '@/types/branch';

// Composable untuk mengambil list cabang (berdasarkan hak akses user)
export function useBranchList() {
  const data = ref<Branch[]>([]);
  const loading = ref<boolean>(false);
  const error = ref<Error | null>(null);

  async function load(
    page?: number,
    limit?: number,
    search?: string,
    sortBy?: string
    ) {
    loading.value = true;
    error.value   = null;
    try {
      data.value = (await fetchBranches(page, limit, search, sortBy)).data;
    } catch (e: any) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  }

  async function loadTableData( params: {
    page?: number,
    limit?: number,
    search?: string,
    sortBy?: string,
    sortDesc?: boolean,
    filters?: Record<string, any>
  }): Promise<{ data: Branch[], total: number }> {
    loading.value = true;
    error.value   = null;
    try {
      const { page, limit, search, sortBy, sortDesc, filters } = params;
      const { data, total } = await fetchBranches(page, limit, search, sortBy, sortDesc, filters);
    return { data, total };
    } catch (e: any) {
      error.value = e;
    } finally {
      loading.value = false;
    }
    return { data: [], total: 0 };
  }

  async function create(payload: CreateBranchPayload) {
    try {
      loading.value = true;
      await createBranch(payload);
      await load();
    } catch (e: any) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  }

  async function update(payload: UpdateBranchPayload) {
    try {
      loading.value = true;
      await updateBranch(payload);
      await load();
    } catch (e: any) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  }

  async function remove(id: string) {
    try {
      loading.value = true;
      await deleteBranch(id);
      await load();
    } catch (e: any) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  }

  return {
    load,
    loadTableData,
    create,
    update,
    remove,
    data,
    loading,
    error 
  };
}