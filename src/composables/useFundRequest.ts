import { ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { fetchFundRequests, createFundRequest, updateFundRequest, deleteFundRequest } from '@/services/finance/fundRequestService';
import type { CreateFundRequest, FundRequest, UpdateFundRequest } from '@/types/finance';

export function useFundRequests() {
  const route     = useRoute();
  const branchId  = ref<string>(String(route.query.branch || 'all'));
  const requests  = ref<FundRequest[]>([]);
  const loading   = ref<boolean>(false);
  const error     = ref<Error | null>(null);

  async function load(id: string) {
    loading.value = true;
    error.value   = null;
    try {
      requests.value = await fetchFundRequests(id);
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
      await load(branchId.value);
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
      await load(branchId.value);
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
      await load(branchId.value);
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

  return { load, branchId, requests, loading, error, create, update };
}