import { ref, onMounted } from 'vue';
import { fetchAllIncomes } from '@/services/finance/financeSummaryService';

export function useAllIncomes() {
  const incomes = ref<Record<string, number>>({});
  const loading = ref(true);
  const error = ref<Error | null>(null);

  async function load() {
    loading.value = true;
    try { incomes.value = await fetchAllIncomes(); }
    catch(e: any) { error.value = e; }
    finally { loading.value = false; }
  }

  onMounted(load);
  return { incomes, loading, error, reload: load };
}