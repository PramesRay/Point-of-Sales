import { ref } from 'vue';
import { fetchCategoryInventoryItems, fetchStockMovements } from '@/services/inventory/inventoryItemService';
import type { InventoryCategory, StockMovement } from '@/types/inventoryItem';

export function useStockMovements() {
  const data      = ref<StockMovement[]>([]);
  const categories= ref<InventoryCategory[]>([]);
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

  return { init, data, categories, loading, error };
}