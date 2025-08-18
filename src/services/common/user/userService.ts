import api from "@/services/api";
import dummyEmployee from "../employee/dummyEmployee";
import type { CreateEmployeePayload, Employee, UpdateEmployeeByEmployee, UpdateEmployeePayloadByOwner } from "@/types/employee";
import { processDummyData } from "@/utils/helpers/dummy-fetching-processing";

export async function fetchUsers({
  page,
  limit,
  search,
  sortBy,
  sortDesc = false,
  filter,
} : {
  page?: number,
  limit?: number,
  search?: string,
  sortBy?: string,
  sortDesc?: boolean,
  filter?: Record<string, any>
}): Promise<{data: Employee[]; total: number}> {
  try {
    const url = `/users`;
    const query = new URLSearchParams();
    
    if (search) query.append('search', search)
    if (sortBy) query.append('sort', `${sortBy}:${sortDesc ? 'desc' : 'asc'}`)
    if (typeof page === 'number') query.append('page', page.toString())
    if (typeof limit === 'number') query.append('limit', limit.toString())

    if (filter) {
      for (const [key, value] of Object.entries(filter)) {
        if (value) {  // Pastikan value valid (tidak null, undefined, atau kosong)
          query.append(key, value);
        }
      }
    }

    const res = await api.get(`${url}?${query.toString()}`)

    return {
      data: res.data.data,
      total: res.data.meta?.total ?? res.data.data.length,
    }
  } catch (error) {
    console.warn(`Fetch users failed, using dummy.`, error);
    const {data, total} = processDummyData(dummyEmployee, {
      page,
      limit,
      search,
      sortBy,
      sortDesc,
      filter,
    });

    return { data: data, total: total }
  }
}

export async function createUser(payload: CreateEmployeePayload): Promise<Employee> {
  try {
    const res = await api.post<Employee>('/users', payload);
    return res.data;
  } catch (error) {
    console.error('Failed to create user:', error);
    throw error;
  }
}

export async function updateUser(payload: UpdateEmployeePayloadByOwner | UpdateEmployeeByEmployee): Promise<Employee> {
  try {
    const res = await api.patch<Employee>(`/users/${payload.id}`, payload);
    return res.data;
  } catch (error) {
    console.error('Failed to update user:', error);
    throw error;
  }
}

export async function deleteUser(id: string): Promise<void> {
  try {
    await api.delete(`/users/${id}`);
  } catch (error) {
    console.error('Failed to delete user:', error);
    throw error;
  }
}