import { ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { fetchFinanceSummary } from '@/services/finance/financeSummaryService';
import type { FinanceSummary } from '@/types/finance';

export function useFinanceDashboard() {
  const route = useRoute();
  const branchId = ref<string>('all');
  const summary  = ref<FinanceSummary[]>([]);
  const loading  = ref<boolean>(false);
  const error    = ref<Error | null>(null);

  async function load(id: string) {
    loading.value = true;
    error.value   = null;
    try {
      summary.value = await fetchFinanceSummary(id);
    } catch (e: any) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  }

  // Auto load on branch query change
  watchEffect(() => {
    const id = String(route.query.branch || 'all');
    branchId.value = id;
    load(id);
  });

  return { branchId, summary, loading, error };
}