import { ref } from 'vue';
import { createStockRequest, updateStockRequest, fetchStockRequestList, fetchStockRequestSummary } from '@/services/inventory/stockRequestService';
import type { ApproveStockRequestPayload, CreateStockRequestPayload, StockRequest, StockRequestSummary, UpdateStockRequestPayload } from '@/types/inventory';

export function useStockRequests() {
  const summary   = ref<StockRequestSummary[]>([]);
  const list      = ref<{ data: StockRequest[]; total: number; }>({ data: [], total: 0 });
  const loading   = ref<boolean>(false);
  const error     = ref<Error | null>(null);

  async function load({
    page,
    limit,
    search,
    sortBy,
    sortDesc,
    filter
  }: {
    page?: number
    limit?: number
    search?: string
    sortBy?: string
    sortDesc?: boolean
    filter?: Record<string, any>
  } = {}) {
    loading.value = true;
    error.value   = null;
    try {
      summary.value = await fetchStockRequestSummary();
      list.value = await fetchStockRequestList({
        page,
        limit,
        search,
        sortBy,
        sortDesc,
        filter
      });
    } catch (e: any) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  }

  async function create(payload: CreateStockRequestPayload) {
    try {
      loading.value = true;
      await createStockRequest(payload);
    } catch (e: any) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  }

  async function update(payload: UpdateStockRequestPayload | ApproveStockRequestPayload) {
    try {
      loading.value = true;
      await updateStockRequest(payload);
    } catch (e: any) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  }

  return { summary, list, loading, error, load, create, update };
}