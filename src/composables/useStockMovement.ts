import { ref } from 'vue';
import { fetchCategoryInvItem, fetchStockMovements, createStockMovement, updateStockMovement, deleteStockMovement } from '@/services/inventory/inventoryItemService';
import type { Category, CreateStockMovementPayload, StockMovement, UpdateStockMovementPayload } from '@/types/inventory';

export function useStockMovements() {
  const data      = ref<{ data: StockMovement[]; total: number; }>({ data: [], total: 0 });
  const categories= ref<Category[]>([]);
  const loading   = ref<boolean>(false);
  const error     = ref<Error | null>(null);

  async function init({
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
  } = {} ) {
    loading.value = true;
    error.value   = null;
    try {
      categories.value = await fetchCategoryInvItem()
      data.value = await fetchStockMovements({
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

  async function create(payload: CreateStockMovementPayload) {
    try {
      loading.value = true;
      await createStockMovement(payload);
      // await init();
    } catch (e: any) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  }

  async function update(payload: UpdateStockMovementPayload) {
    try {
      loading.value = true;
      await updateStockMovement(payload);
      // await init();
    } catch (e: any) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  }

  async function remove(id: string) {
    try {
      loading.value = true;
      await deleteStockMovement(id);
      // await init();
    } catch (e: any) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  }

  return { init, data, categories, loading, error, create, update, remove };
}