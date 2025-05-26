import { ref } from 'vue';
import { fetchCategoryInventoryItems, fetchStockMovements, createStockMovement, updateStockMovement } from '@/services/inventory/inventoryItemService';
import type { Category, StockMovement } from '@/types/inventory';

export function useStockMovements() {
  const data      = ref<StockMovement[]>([]);
  const categories= ref<Category[]>([]);
  const loading   = ref<boolean>(false);
  const error     = ref<Error | null>(null);

  async function init() {
    loading.value = true;
    error.value   = null;
    try {
      data.value = await fetchStockMovements();
      categories.value = await fetchCategoryInventoryItems()
    } catch (e: any) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  }

  async function create(payload: any) {
    try {
      loading.value = true;
      await createStockMovement(payload);
      await init();
    } catch (e: any) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  }

  async function update(payload: any) {
    try {
      loading.value = true;
      await updateStockMovement(payload);
      await init();
    } catch (e: any) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  }

  return { init, data, categories, loading, error, create, update };
}