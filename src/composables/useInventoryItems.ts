import { ref } from 'vue';
import { fetchCategoryInventoryItems, fetchInventoryItem } from '@/services/inventory/inventoryItemService';
import type { Category, InventoryItem } from '@/types/inventoryItem';

export function useInventoryItems() {
  const data      = ref<InventoryItem[]>([]);
  const categories= ref<Category[]>([]);
  const loading   = ref<boolean>(false);
  const error     = ref<Error | null>(null);

  async function init() {
    loading.value = true;
    error.value   = null;
    try {
      data.value = await fetchInventoryItem();
      categories.value = await fetchCategoryInventoryItems()
    } catch (e: any) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  }

  return { init, data, categories, loading, error };
}