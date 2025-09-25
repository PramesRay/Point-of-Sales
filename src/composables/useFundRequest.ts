import { ref, watchEffect } from 'vue';
import { fetchFundRequests, createFundRequest, updateFundRequest, deleteFundRequest, approveFundRequest, finishFundRequest } from '@/services/finance/fundRequestService';
import type { ApproveFundRequest, CreateFundRequest, FundRequest, UpdateFundRequest } from '@/types/finance';

export function useFundRequests() {
  const data  = ref<{ data: FundRequest[]; total: number; }>({ data: [], total: 0 });
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
      data.value = await fetchFundRequests({
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

  async function create(payload: CreateFundRequest) {
    try {
      loading.value = true;
      await createFundRequest(payload);
      // await load();
    } catch (e: any) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  }

  async function update(payload: UpdateFundRequest) {
    try {
      loading.value = true;
      await updateFundRequest(payload);
      // await load();
    } catch (e: any) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  }

  async function approve(payload: ApproveFundRequest) {
    try {
      loading.value = true;
      await approveFundRequest(payload);
      // await load();
    } catch (e: any) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  }

  async function remove(id: string) {
    try {
      loading.value = true;
      await deleteFundRequest(id);
      // await load();
    } catch (e: any) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  }

  async function finish(id: string) {
      try {
        loading.value = true;
        await finishFundRequest(id);
      } catch (e: any) {
        error.value = e;
      } finally {
        loading.value = false;
      }
    }

  return { 
    load, 
    data, 
    loading, 
    error, 
    create,
    update,
    approve,
    remove,
    finish
  };
}