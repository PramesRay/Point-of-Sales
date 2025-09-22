import type { Branch, CreateBranchPayload, UpdateBranchPayload } from '@/types/branch'
import api from '../../api'

export async function fetchBranches(
  page?: number,
  limit?: number,
  search?: string,
  sortBy?: string,
  sortDesc: boolean = false,
  filter?: Record<string, any>
): Promise<{data: Branch[]; total: number}> {
  try {
    const url = `/branch`;
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
    console.warn(`Fetch branches in failed, using dummy.`, error);
    return { data: [], total: 0 };
  }
}

export async function createBranch(payload: CreateBranchPayload): Promise<Branch> {
  try {
    const res = await api.post('/branch', payload);
    return res.data;
  } catch (error) {
    console.error('Failed to create branch:', error);
    throw error;
  }
}

export async function updateBranch(payload: UpdateBranchPayload): Promise<Branch> {
  try {
    const res = await api.put(`/branch/${payload.id}`, payload);
    return res.data;
  } catch (error) {
    console.error('Failed to update branch:', error);
    throw error;
  }
}

export async function deleteBranch(id: string): Promise<void> {
  try {
    await api.delete(`/branch/${id}`);
  } catch (error) {
    console.error('Failed to delete branch:', error);
    throw error;
  }
}