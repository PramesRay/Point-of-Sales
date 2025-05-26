import api from '@/services/api';
import dummyFundRequestData from '@/services/finance/dummyFundRequest';
import type { CreateFundRequest, FundRequest, UpdateFundRequest } from '@/types/finance';
import branchList from '@/services/common/branch/dummyBranchList'; 
import { useAlertStore } from '@/stores/alert';

const alertStore = useAlertStore();

/**
 * Fetch fund requests for a branch or all if branchId === 'all'.
 */
export async function fetchFundRequests(branchId: string): Promise<FundRequest[]> {
  if (branchId === 'all') {
    try {
      const res = await api.get<FundRequest[]>(`/finance/fund-requests/all`);
      return res.data;
    } catch {
      console.warn('Fetch all fund-requests failed, using dummy');
      return dummyFundRequestData;
    }
  }

  try {
    const res = await api.get<FundRequest[]>(`/finance/${encodeURIComponent(branchId)}/fund-requests`);
    return res.data;
  } catch (error) {
    console.warn(`Fetch fund requests for "${branchId}" failed, using dummy.`, error);
    return dummyFundRequestData.filter(tx => tx.branch.id === branchId);
  }
}

export async function createFundRequest(payload: CreateFundRequest): Promise<FundRequest> {
  try {
    const res = await api.post<FundRequest>(`/finance/fund-requests`, payload);
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
    const res = await api.put<FundRequest>(`/finance/fund-requests`, payload);
    alertStore.showAlert('Permintaan Dana berhasil diubah!', 'success');
    return res.data;
  } catch (error) {
    alertStore.showAlert('Permintaan Dana gagal diubah!', 'error');
    console.warn(`Update fund request failed, using dummy.`, error);
    throw error
  }
}