import { ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { createTransaction, deleteTransaction, fetchTransactions, updateTransaction } from '@/services/finance/transactionService';
import type { CreateTransactionPayload, Transaction, UpdateTransactionPayload } from '@/types/finance';

export function useTransactions() {
  const data = ref<Transaction[]>([]);
  const loading = ref<boolean>(false);
  const error = ref<Error | null>(null);

  async function load(
    id?: string,
    page?: number,
    limit?: number,
    search?: string,
    sortBy?: string
    ) {
    loading.value = true;
    error.value   = null;
    try {
      data.value = (await fetchTransactions(id, page, limit, search, sortBy)).data;
    } catch (e: any) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  }

  async function loadTableData( params: {
    page?: number,
    limit?: number,
    search?: string,
    sortBy?: string,
    sortDesc?: boolean,
    filters?: Record<string, any>
  }): Promise<{ data: Transaction[], total: number }> {
    loading.value = true;
    error.value   = null;
    try {
      const { page, limit, search, sortBy, sortDesc, filters } = params;
      const { data, total } = await fetchTransactions(undefined, page, limit, search, sortBy, sortDesc, filters);
    return { data, total };
    } catch (e: any) {
      error.value = e;
    } finally {
      loading.value = false;
    }
    return { data: [], total: 0 };
  }

  async function create(payload: CreateTransactionPayload) {
    try {
      loading.value = true;
      await createTransaction(payload);
      await load();
    } catch (e: any) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  }

  async function update(payload: UpdateTransactionPayload) {
    try {
      loading.value = true;
      await updateTransaction(payload);
      await load();
    } catch (e: any) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  }

  async function remove(id: string) {
    try {
      loading.value = true;
      await deleteTransaction(id);
      await load();
    } catch (e: any) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  }

  return {
    load,
    loadTableData,
    create,
    update,
    remove,
    data,
    loading,
    error };
}