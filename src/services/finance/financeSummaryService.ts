import api from '@/services/api';
import dummyFinanceSummary from './dummyFinanceSummary';
import type { FinanceSummary } from '@/types/finance';
import dummyAllIncomes from '@/services/finance/dummyAllIncomes';
import type { AllIncomes } from '@/types/finance';

/**
 * Fetch incomes for all branches.
 * Falls back to dummyAllIncomes if API call fails.
 */
export async function fetchAllIncomes(): Promise<AllIncomes> {
  try {
    const res = await api.get<AllIncomes>('/finance/summary/all/incomes');
    return res.data;
  } catch (error) {
    console.warn('Fetch all incomes failed, using dummy', error);
    return dummyAllIncomes;
  }
}

/**
 * Fetch finance summary for a specific branch.
 * Falls back to dummy data if API call fails.
 */
export async function fetchFinanceSummary(branchId: string): Promise<FinanceSummary[]> {
  if (branchId == 'all') {
    try {
      const res = await api.get<FinanceSummary[]>(`/finance/summary/all}`);
      return res.data;
    } catch (error) {
      console.warn(`Fetch finance summary for all branch failed, using dummy data.`, error);
      return dummyFinanceSummary
    }
  }
  
  try {
    const res = await api.get<FinanceSummary[]>(`/finance/summary/${encodeURIComponent(branchId)}`);
    return res.data;
  } catch (error) {
    console.warn(`Fetch finance summary for "${branchId}" failed, using dummy data.`, error);
    const fallback = dummyFinanceSummary.filter(tx => tx.branchId === branchId || tx.branchId === 'all');;
    console.log(fallback)
    if (!fallback) {
      throw new Error(`No dummy finance data available for branch "${branchId}"`);
    }
    return fallback;
  }
}