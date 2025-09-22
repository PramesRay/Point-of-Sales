import { ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { fetchFinanceSummary } from '@/services/finance/financeSummaryService';
import type { FinanceSummary } from '@/types/finance';

export function useFinanceDashboard() {
  const summary  = ref<FinanceSummary>();
  const loading  = ref<boolean>(false);
  const error    = ref<Error | null>(null);

  async function load({ filter }: { filter?: Record<string, any> } = {}) {
    loading.value = true;
    error.value   = null;
    try {
      summary.value = await fetchFinanceSummary(filter);
    } catch (e: any) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  }

  return { load, summary, loading, error };
}