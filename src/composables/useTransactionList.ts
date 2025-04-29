import { ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { fetchTransactions } from '@/services/finance/transactionService';
import type { Transaction } from '@/types/finance';

export function useTransactions() {
  const route = useRoute();
  const branchId = ref<string>(String(route.query.branch || 'all'));
  const transactions = ref<Transaction[]>([]);
  const loading = ref<boolean>(false);
  const error = ref<Error | null>(null);

  async function load(id: string) {
    loading.value = true;
    error.value   = null;
    try {
      transactions.value = await fetchTransactions(id);
    } catch (e: any) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  }

  watchEffect(() => {
    const id = String(route.query.branch || 'all');
    branchId.value = id;
    load(id);
  });

  return { branchId, transactions, loading, error };
}