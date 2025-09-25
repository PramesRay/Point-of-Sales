import api from '@/services/api';
import type { StockRequestSummary, StockRequest, CreateStockRequestPayload, UpdateStockRequestPayload, ApproveStockRequestPayload } from '@/types/inventory';
import { useAlertStore } from '@/stores/alert';
const alertStore = useAlertStore();

export async function fetchStockRequestSummary({
  filter
}: {
  filter?: Record<string, any>
} = {}): Promise<StockRequestSummary[]> {
  try {
    let url = `/inventory/stock-requests/summary`;
    let query = new URLSearchParams();
    
    if (filter) {
        for (const [key, value] of Object.entries(filter)) {
          if (value) {  // Pastikan value valid (tidak null, undefined, atau kosong)
            query.append(key, value);
          }
        }
      }
  
      const res = await api.get(`${url}?${query.toString()}`)
  
      return res.data
  } catch {
    console.warn('Fetch all stock-request failed, using dummy');
    return [];
  }
}

export async function fetchStockRequestList({
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
  } = {}): Promise<{data: StockRequest[]; total: number}> {
    try {
      const url = `/inventory/stock-requests`;
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
      console.warn(`Fetch Stock Request data failed, using dummy.`, error);
      return { data: [], total: 0 };
    }
}

export async function createStockRequest(payload: CreateStockRequestPayload): Promise<StockRequest> {
  try {
    const res = await api.post(`/inventory/stock-request`, payload);
    alertStore.showAlert('Permintaan Stok berhasil dibuat!', 'success');
    return res.data.data;
  } catch (error) {
    console.warn(`Create stock request failed, using dummy.`, error);
    console.log('Payload: ', payload)
    throw error
  }  
}

export async function updateStockRequest(payload: UpdateStockRequestPayload | ApproveStockRequestPayload): Promise<StockRequest> {
  try {
    const res = await api.put(`/inventory/stock-request`, payload);
    alertStore.showAlert('Permintaan Stok berhasil diubah!', 'success');
    return res.data.data;
  } catch (error) {
    console.warn(`Update stock request failed, using dummy.`, error);
    console.log('Payload: ', payload)
    throw error
  }  
}

export async function readyStockRequest(id: string): Promise<StockRequest> {
  try {
    const res = await api.put(`/inventory/stock-request/${id}/ready`);
    alertStore.showAlert('Permintaan Stok telah siap!', 'success');
    return res.data.data;
  } catch (error) {
    throw error
  }  
}

export async function finishStockRequest(id: string): Promise<StockRequest> {
  try {
    const res = await api.put(`/inventory/stock-request/${id}/end`);
    alertStore.showAlert('Permintaan Stok berhasil dikonfirmasi!', 'success');
    return res.data.data;
  } catch (error) {
    throw error
  }  
}