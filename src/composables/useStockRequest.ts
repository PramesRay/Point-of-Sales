import { ref } from 'vue';
import { createStockRequest, updateStockRequest, fetchStockRequestList, fetchStockRequestSummary, finishStockRequest, readyStockRequest } from '@/services/inventory/stockRequestService';
import type { ApproveStockRequestPayload, CreateStockRequestPayload, StockRequest, StockRequestSummary, UpdateStockRequestPayload } from '@/types/inventory';

export function useStockRequests() {
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

  async function finish(id: string) {
    try {
      loading.value = true;
      await finishStockRequest(id);
    } catch (e: any) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  }

  async function ready(id: string) {
    try {
      loading.value = true;
      await readyStockRequest(id);
    } catch (e: any) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  }

  return { list, loading, error, load, create, update, ready, finish };
}