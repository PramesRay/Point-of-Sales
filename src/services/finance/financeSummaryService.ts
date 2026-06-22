import api from '@/services/api';
import type { FinanceSummary } from '@/types/finance';

export async function fetchFinanceSummary({ filter }: { filter?: Record<string, any> } = {}): Promise<FinanceSummary> {
  try {
    const url = `/finance-summary`;
    const query = new URLSearchParams();
    if (filter) {
      for (const [key, value] of Object.entries(filter)) {
        if (value) {  // Pastikan value valid (tidak null, undefined, atau kosong)
          query.append(key, value);
        }
      }
    }
    const res = await api.get(`${url}?${query.toString()}`);
    return res.data.data;
  } catch (error) {
    throw error;
  }
}