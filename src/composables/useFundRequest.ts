import { ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { fetchFundRequests } from '@/services/finance/fundRequestService';
import type { FundRequest } from '@/types/finance';

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

  watchEffect(() => {
    const id = String(route.query.branch || 'all');
    branchId.value = id;
    load(id);
  });

  return { branchId, requests, loading, error };
}