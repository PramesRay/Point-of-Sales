import { ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { createStockRequest, updateStockRequest, fetchStockRequestList, fetchStockRequestSummary } from '@/services/inventory/stockRequestService';
import type { StockRequestList, StockRequestSummary } from '@/types/inventory';

export function useStockRequests() {
  const branchId  = ref<string>();
  const summary   = ref<StockRequestSummary[]>([]);
  const list      = ref<StockRequestList[]>([]);
  const loading   = ref<boolean>(false);
  const error     = ref<Error | null>(null);

  async function load(id?: string) {
    loading.value = true;
    error.value   = null;
    try {
      summary.value = await fetchStockRequestSummary(id);
      list.value = await fetchStockRequestList(id);
    } catch (e: any) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  }

  async function create(payload: any) {
    try {
      loading.value = true;
      await createStockRequest(payload);
    } catch (e: any) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  }

  async function update(payload: any) {
    try {
      loading.value = true;
      await updateStockRequest(payload);
    } catch (e: any) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  }

  return { branchId, summary, list, loading, error, load, create, update };
}