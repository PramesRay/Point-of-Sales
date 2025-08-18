import { createCategoryMenu, createMenu, deleteCategoryMenu, deleteMenu, fetchCategorMenu, fetchMenuSales, qtyMenuUpdate, updateCategoryMenu, updateMenu } from '@/services/menu/menuItemService';
import type { Category, CreateCategoryPayload, UpdateCategoryPayload } from '@/types/inventory';
import type { CreateMenuPayload, Menu, MenuSale, RestockMenuSalesPayload, UpdateMenuPayload } from '@/types/menu';
import { ref } from 'vue';

export function useMenuItems() {
  const loading = ref(false);
  const error = ref<Error | null>(null);
  const data = ref<Menu[]>([]);
  const dataItemSales = ref<MenuSale[]>([]);
  const categories= ref<Category[]>([]);
  
  async function load(id?: string) {
    try {
      loading.value = true;
      error.value = null;
      dataItemSales.value = (await fetchMenuSales(id)).data;
      categories.value = await fetchCategorMenu()
    } catch (e: any) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  }

  // Fungsi untuk digunakan oleh GlobalTable.vue
  async function fetchTableData({
    page,
    itemsPerPage,
    search,
    sortBy,
    sortDesc,
    branchId,
  }: {
    page?: number
    itemsPerPage?: number
    search?: string
    sortBy?: string
    sortDesc?: boolean
    branchId?: string
  } = {}) {
    try {
      const { data, total } = await fetchMenuSales(
        branchId,
        page,
        itemsPerPage,
        search,
        sortBy,
        sortDesc
      )
      return { data, total }
    } catch (e) {
      console.error('Error fetching table data:', e)
      return { data: [], total: 0 }
    }
  }

  async function create(payload: CreateMenuPayload) {
    try {
      loading.value = true;
      await createMenu(payload);
    } catch (e: any) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  }

  async function update(payload: UpdateMenuPayload) {
    try {
      loading.value = true;
      await updateMenu(payload);
    } catch (e: any) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  }

  async function qtyUpdate(payload: RestockMenuSalesPayload) {
    try {
      loading.value = true;
      await qtyMenuUpdate(payload);
    } catch (e: any) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  }

  async function remove(id: string) {
    try {
      loading.value = true;
      await deleteMenu(id);
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
      categories.value = await fetchCategorMenu()
    } catch (e: any) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  }

  // create function
  async function createCategory(payload: CreateCategoryPayload) {
    loading.value = true;
    try {
      await createCategoryMenu(payload);
    } catch (e: any) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  }

  async function updateCategory(payload: UpdateCategoryPayload) {
    loading.value = true;
    try {
      await updateCategoryMenu(payload);
    } catch (e: any) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  }

  async function removeCategory(id: string) {
    loading.value = true;
    try {
      await deleteCategoryMenu(id);
    } catch (e: any) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  }

  return {
    load,
    create,
    update,
    qtyUpdate,
    remove,
    
    loadCategory,
    createCategory,
    updateCategory,
    removeCategory,

    data,
    dataItemSales,
    categories,
    loading,
    error,
    fetchTableData,
  }  
}