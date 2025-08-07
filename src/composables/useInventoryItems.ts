import { ref } from 'vue';
import { fetchCategoryInvItem, fetchInventoryItem, createItem as createInventoryItem, updateItem as updateInventoryItem, deleteItem as deleteInventoryItem, createCategoryInvItem, updateCategoryInvItem, deleteCategoryInvItem } from '@/services/inventory/inventoryItemService';
import type { Category, CreateCategoryPayload, CreateInventoryItemPayload, InventoryItem, UpdateCategoryPayload, UpdateInventoryItemPayload } from '@/types/inventory';

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
      console.log('data.value', data.value)
      categories.value = await fetchCategoryInvItem()
      console.log('categories.value', categories.value)
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
      // await init();
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
      // await init();
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
      // await init();
    } catch (e: any) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  }

  async function loadCategory() {
    loading.value = true;
    error.value   = null;
    try {
      categories.value = await fetchCategoryInvItem()
    } catch (e: any) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  }

  async function createCategory(payload: CreateCategoryPayload) {
    try {
      loading.value = true;
      await createCategoryInvItem(payload);
      await loadCategory();
    } catch (e: any) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  }

  async function updateCategory(payload: UpdateCategoryPayload) {
    try {
      loading.value = true;
      await updateCategoryInvItem(payload);
      await loadCategory();
    } catch (e: any) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  }

  async function deleteCategory(id: string) {
    try {
      loading.value = true;
      await deleteCategoryInvItem(id);
      await loadCategory();
    } catch (e: any) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  }

  return {
    init,
    loadCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    createItem,
    updateItem,
    deleteItem,
    data,
    categories,
    loading,
    error,
  };
}