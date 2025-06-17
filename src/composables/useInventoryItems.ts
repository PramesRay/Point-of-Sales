import { ref } from 'vue';
import { fetchCategoryInventoryItems, fetchInventoryItem, createItem as createInventoryItem, updateItem as updateInventoryItem, deleteItem as deleteInventoryItem } from '@/services/inventory/inventoryItemService';
import type { Category, CreateInventoryItemPayload, InventoryItem, UpdateInventoryItemPayload } from '@/types/inventory';

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

  async function createItem(payload: CreateInventoryItemPayload) {
    try {
      loading.value = true;
      await createInventoryItem(payload);
      await init();
    } catch (e: any) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  }

  async function updateItem(payload: UpdateInventoryItemPayload) {
    try {
      loading.value = true;
      await updateInventoryItem(payload);
      await init();
    } catch (e: any) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  }

  async function deleteItem(id: string) {
    try {
      loading.value = true;
      await deleteInventoryItem(id);
      await init();
    } catch (e: any) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  }

  return { init, data, categories, loading, error, createItem, updateItem, deleteItem };
}