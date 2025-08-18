import api from '@/services/api';
import { fetchUsers, createUser, updateUser, deleteUser } from '@/services/common/user/userService';
import type { CreateEmployeePayload, Employee, UpdateEmployeeByEmployee, UpdateEmployeePayloadByOwner } from '@/types/employee';
import { ref } from 'vue';

export function useUser() {
  const data = ref<Employee[]>([]);
  const loading = ref<boolean>(false);
  const error = ref<Error | null>(null);

  async function load({
    page,
    limit,
    search,
    sortBy,
    sortDesc,
    filter
  }: {
    page?: number
    limit?: number
    search?: string
    sortBy?: string
    sortDesc?: boolean
    filter?: Record<string, any>
  } = {}) {
    loading.value = true;
    error.value   = null;
    try {
      data.value = (await fetchUsers({
        page,
        limit,
        search,
        sortBy,
        sortDesc,
        filter
      })).data;
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
      const { data, total } = await fetchUsers({
        page,
        limit,
        search,
        sortBy,
        sortDesc,
        filter: filters
      });
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
