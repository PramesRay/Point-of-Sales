import { onMounted, ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { fetchCategoryInventoryItems, fetchInventoryItem } from '@/services/inventory/inventoryItemService';
import type { InventoryCategory, InventoryItem } from '@/types/inventoryItem';

export function useInventoryItems() {
  const route     = useRoute();
  const branchId  = ref<string>(String(route.query.branch || 'all'));
  const data      = ref<InventoryItem[]>([]);
  const categories= ref<InventoryCategory[]>([]);
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