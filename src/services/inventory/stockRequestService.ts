import api from '@/services/api';
import dummyStockRequestSummary from '@/services/inventory/dummyStockRequestSummary';
import dummyStockRequestList from "@/services/inventory/dummyStockRequestList";
import type { StockRequestSummary, StockRequest } from '@/types/inventory';
import branchList from '@/services/common/branch/dummyBranchList'; 
import { useAlertStore } from '@/stores/alert';
const alertStore = useAlertStore();

/**
 * Fetch fund requests for a branch or all if branchId === 'all'.
 */
export async function fetchStockRequestSummary(id?: string): Promise<StockRequestSummary[]> {
  try {
    let url = `/inventory/stock-requests/summary`;
    let queryParams = '';
    
    if (!id) {
      const res = await api.get<StockRequestSummary[]>(url);
      return res.data;
    }
    queryParams += `?branch=${id}`

    const res = await api.get<StockRequestSummary[]>(url + queryParams);
    return res.data;

  } catch {
    console.warn('Fetch all stock-requests failed, using dummy');
    let dummy = dummyStockRequestSummary;
    if (!id) {
      return dummy.filter(req => req.branch.id === 'all')
    }
    return dummy.filter(req => req.branch.id === id);
    
  }

}

export async function fetchStockRequestList(
  branchId?: string,
  page?: number ,
  limit?: number
): Promise<StockRequest[]> {
  try {
    let url = `/inventory/stock-requests`;
    let queryParams = '';

    // Tambahkan query params jika filter diberikan
    if (!branchId && !page && !limit) {
      const res = await api.get<StockRequest[]>(url);
      return res.data;
    }
    
    if (branchId) {
      queryParams += `?branch=${branchId}`
    }
    
    if (page || limit) {
      if (!page) page = 1;
      if (!limit) limit = 10;
      queryParams += `&page=${page}&limit=${limit}`
    }

    const res = await api.get<StockRequest[]>(url + queryParams);
    return res.data;
    
  } catch (error) {
    console.warn(`Fetch Stock Request List failed, using dummy.`, error);
    let dummy = dummyStockRequestList;
    if (!branchId && !page && !limit) {
      return dummyStockRequestList;
    }
    
    if (branchId) {
      dummy = dummy.filter(req => req.branch.id === branchId);
    }
    
    if (page || limit) {
      if (!page) page = 1;
      if (!limit) limit = 10;

      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      dummy = dummy.slice(startIndex, endIndex);
    }
    
    return dummy
  } 
}

export async function createStockRequest(payload: any): Promise<StockRequest> {
  try {
    const res = await api.post<StockRequest>(`/inventory/stock-requests`, payload);
    alertStore.showAlert('Permintaan Stok berhasil dibuat!', 'success');
    return res.data;
  } catch (error) {
    console.warn(`Create stock request failed, using dummy.`, error);
    console.log('Payload: ', payload)
    throw error
  }  
}

export async function updateStockRequest(payload: any): Promise<StockRequest> {
  try {
    const res = await api.put<StockRequest>(`/inventory/stock-requests`, payload);
    alertStore.showAlert('Permintaan Stok berhasil diubah!', 'success');
    return res.data;
  } catch (error) {
    console.warn(`Update stock request failed, using dummy.`, error);
    console.log('Payload: ', payload)
    throw error
  }  
}