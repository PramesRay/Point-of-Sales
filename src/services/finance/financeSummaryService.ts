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
    console.warn(`Fetch finance summary failed, using dummy data.`, error);
    return { 
      income: {
        period: {
          start: new Date(),
          end: new Date()
        },
        total: {
          grossSales: 0,
          refunds: 0,
          netIncome: 0
        },
        perBranch: []
      },
      expenses: {
        totalExpenses: { today: 0, week: 0, month: 0, year: 0 },
        chartData: {
          today: { categories: [], series: [] },
          week: { categories: [], series: [] },
          month: { categories: [], series: [] },
          year: { categories: [], series: [] },
        }
      },
      order: {
        current: 0,
        week: [],
        month: []
      },
      branch: { id: '', name: ''}
    };
  }
}