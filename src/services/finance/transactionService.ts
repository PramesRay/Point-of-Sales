import api from '@/services/api';
import dummyTransactionSummary from '@/services/finance/dummyTransaction';
import type { Transaction } from '@/types/finance';
import branchList from '@/services/common/branch/dummyBranchList';

// function flattenAllDummy(): Transaction[] {
//   return Object.entries(dummyTransactionSummary).flatMap(([branchId, transactions]) =>
//     transactions.map(t => ({
//       ...t,
//       branchId,
//       branchName: branchList.find(b => b.id === branchId)?.name || branchId // fallback ke ID kalau nama tidak ditemukan
//     }))
//   );
// }

/**
 * Fetch transactions for a specific branch or all if branchId === 'all'.
 */
export async function fetchTransactions(branchId: string): Promise<Transaction[]> {
  if (branchId === 'all') {
    try {
      const res = await api.get<Transaction[]>(`/finance/transactions/all`);
      return res.data;
    } catch {
      console.warn('Fetch all transactions failed, using dummy');
      return dummyTransactionSummary;
    }
  }

  // branch-specific
  try {
    const res = await api.get<Transaction[]>(`/finance/${encodeURIComponent(branchId)}/transactions`);
    return res.data;
  } catch (error) {
    console.warn(`Fetch transactions for "${branchId}" failed, using dummy.`, error);
    return dummyTransactionSummary.filter(tx => tx.branchId === branchId);
  }
}