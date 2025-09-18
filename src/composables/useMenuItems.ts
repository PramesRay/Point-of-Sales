import { fetchCategorMenu, fetchMenuSales } from '@/services/menu/menuItemService';
import type { Category } from '@/types/inventory';
import type { Menu } from '@/types/menu';
import { ref } from 'vue';

export function useMenuItems() {
  const loading = ref(false);
  const error = ref<Error | null>(null);
  const data = ref<Menu[]>([]);
  const categories= ref<Category[]>([]);
    
  async function loadItemSales(id?: string) {
    loading.value = true;
    error.value = null;
    try {
      data.value = await fetchMenuSales(id);
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

  return {
    loadItemSales, 
    loadCategory,
    data,
    categories,
    loading,
    error,
  }  
}