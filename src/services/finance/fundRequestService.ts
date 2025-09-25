import api from '@/services/api';
import type { ApproveFundRequest, CreateFundRequest, FundRequest, UpdateFundRequest } from '@/types/finance';
import { useAlertStore } from '@/stores/alert';

const alertStore = useAlertStore();

/**
 * Fetch fund requests for a branch or all if branchId === 'all'.
 */
export async function fetchFundRequests({
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
} = {}): Promise<{data: FundRequest[]; total: number}> {
  try {
    const url = `/finance/fund-requests`;
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
    console.warn(`Fetch Fund Request data failed, using dummy.`, error);
    return { data: [], total: 0 }; 
  }
}

export async function createFundRequest(payload: CreateFundRequest): Promise<FundRequest> {
  try {
    const res = await api.post<FundRequest>(`/finance/fund-request`, payload);
    alertStore.showAlert('Permintaan Dana berhasil dibuat!', 'success');
    return res.data;
  } catch (error) {
    alertStore.showAlert('Permintaan Dana gagal dibuat!', 'error');
    console.warn(`Create fund request failed, using dummy.`, error);
    throw error
  }
}

export async function updateFundRequest(payload: UpdateFundRequest): Promise<FundRequest> {
  try {
    const res = await api.put<FundRequest>(`/finance/fund-request`, {...payload, type: 'updateFundRequest'});
    alertStore.showAlert(`Permintaan Dana ${payload.id} berhasil diubah!`, 'success');
    return res.data;
  } catch (error) {
    alertStore.showAlert(`Permintaan Dana ${payload.id} berhasil diubah!`, 'error');
    console.warn(`Update fund request failed, using dummy.`, error);
    throw error
  }
}

export async function approveFundRequest(payload: ApproveFundRequest): Promise<FundRequest> {
  try {
    const res = await api.put<FundRequest>(`/finance/fund-request`, {...payload, type: 'approveFundRequest'});
    alertStore.showAlert(`Permintaan Dana ${payload.id} berhasil diubah!`, 'success');
    return res.data;
  } catch (error) {
    alertStore.showAlert(`Permintaan Dana ${payload.id} berhasil diubah!`, 'error');
    console.warn(`Update fund request failed, using dummy.`, error);
    throw error
  }
}

export async function finishFundRequest(id: string): Promise<FundRequest> {
  try {
    const res = await api.put(`/finance/fund-request/${id}/end`);
    alertStore.showAlert('Permintaan Stok berhasil dikonfirmasi!', 'success');
    return res.data.data;
  } catch (error) {
    throw error
  }  
}

export async function deleteFundRequest(id: string): Promise<void> {
  try {
    await api.delete(`/finance/fund-request/${id}`);
    alertStore.showAlert(`Permintaan Dana ${id} berhasil dihapus!`, 'success');
  } catch (error) {
    alertStore.showAlert(`Permintaan Dana ${id} gagal dihapus!`, 'error');
    console.warn(`Delete fund request failed, using dummy.`, error);
    throw error
  }
}