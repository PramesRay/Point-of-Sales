import api from '@/services/api';
import { fetchUsers, createUser, updateUser, deleteUser } from '@/services/common/user/userService';
import type { CreateEmployeePayload, Employee, UpdateEmployeeByEmployee, UpdateEmployeePayloadByOwner } from '@/types/user';
import { ref } from 'vue';

export function useUser() {
  const data = ref<Employee[]>([]);
  const loading = ref<boolean>(false);
  const error = ref<Error | null>(null);

  async function load(
    id?: string,
    page?: number,
    limit?: number,
    search?: string,
    sortBy?: string
    ) {
    loading.value = true;
    error.value   = null;
    try {
      data.value = (await fetchUsers(id, page, limit, search, sortBy)).data;
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
  }): Promise<{ data: Employee[], total: number }> {
    loading.value = true;
    error.value   = null;
    try {
      const { page, limit, search, sortBy, sortDesc, filters } = params;
      const { data, total } = await fetchUsers(undefined, page, limit, search, sortBy, sortDesc, filters);
    return { data, total };
    } catch (e: any) {
      error.value = e;
    } finally {
      loading.value = false;
    }
    return { data: [], total: 0 };
  }

  async function create(payload: CreateEmployeePayload) {
    try {
      loading.value = true;
      await createUser(payload);
      await load();
    } catch (e: any) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  }

  async function update(payload: UpdateEmployeePayloadByOwner | UpdateEmployeeByEmployee) {
    try {
      loading.value = true;
      await updateUser(payload);
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
      await deleteUser(id);
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
