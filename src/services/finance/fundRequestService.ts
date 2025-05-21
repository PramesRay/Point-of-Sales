import api from '@/services/api';
import dummyFundRequestData from '@/services/finance/dummyFundRequest';
import type { FundRequest } from '@/types/finance';
import branchList from '@/services/common/branch/dummyBranchList'; 

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
    return dummyFundRequestData.filter(tx => tx.branchId === branchId);
  }
}