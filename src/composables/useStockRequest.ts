import { ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { fetchStockRequestList, fetchStockRequestSummary } from '@/services/inventory/stockRequestService';
import type { StockRequestList, StockRequestSummary } from '@/types/inventory';

export function useStockRequests() {
  const route     = useRoute();
  const branchId  = ref<string>(String(route.query.branch || 'all'));
  const summary   = ref<StockRequestSummary[]>([]);
  const list      = ref<StockRequestList[]>([]);
  const loading   = ref<boolean>(false);
  const error     = ref<Error | null>(null);

  async function load(id: string) {
    loading.value = true;
    error.value   = null;
    try {
      summary.value = await fetchStockRequestSummary();
      list.value = await fetchStockRequestList(id);
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

  return { branchId, summary, list, loading, error };
}