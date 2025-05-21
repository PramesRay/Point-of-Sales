import api from '@/services/api';
import dummyStockRequestSummary from '@/services/inventory/dummyStockRequestSummary';
import dummyStockRequestList from "@/services/inventory/dummyStockRequestList";
import type { StockRequestSummary, StockRequestList } from '@/types/inventory';
import branchList from '@/services/common/branch/dummyBranchList'; 
import { useAlertStore } from '@/stores/alert';
const alertStore = useAlertStore();

/**
 * Fetch fund requests for a branch or all if branchId === 'all'.
 */
export async function fetchStockRequestSummary(): Promise<StockRequestSummary[]> {
  try {
    const res = await api.get<StockRequestSummary[]>(`/inventory/stock-requests/all`);
    return res.data;
  } catch {
    console.warn('Fetch all stock-requests failed, using dummy');
    return dummyStockRequestSummary;
  }

}

export async function fetchStockRequestList(branchId: string): Promise<StockRequestList[]> {
  try {
    const res = await api.get<StockRequestList[]>(`/inventory/${encodeURIComponent(branchId)}/stock-requests`);
    return res.data;
  } catch (error) {
    console.warn(`Fetch fund requests for "${branchId}" failed, using dummy.`, error);
    if (branchId === 'all') {
      return dummyStockRequestList
    }
    return dummyStockRequestList.filter(tx => tx.branch.id === branchId);
  }  
}

export async function createStockRequest(payload: any): Promise<StockRequestList> {
  try {
    const res = await api.post<StockRequestList>(`/inventory/stock-requests`, payload);
    alertStore.showAlert('Permintaan Stok berhasil dibuat!', 'success');
    return res.data;
  } catch (error) {
    console.warn(`Create stock request failed, using dummy.`, error);
    throw error
  }  
}