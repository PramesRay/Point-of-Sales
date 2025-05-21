import { fetchCategorMenuItems, fetchMenuItems } from '@/services/menu/menuItemService';
import type { Branch } from '@/types/branch';
import type { Category } from '@/types/inventoryItem';
import type { Menu } from '@/types/menu';
import { ref, watchEffect } from 'vue';

const branches = ref<Branch[]>([]);
const selectedBranch = ref<string>(''); // default kosong
const loadingBranches = ref(true);
const loadingData = ref(true);
const error     = ref<Error | null>(null);

const data      = ref<Menu[]>([]);
const categories= ref<Category[]>([]);

async function init() {
  loadingData.value = true;
  error.value   = null;
  try {
    data.value = await fetchMenuItems();
    categories.value = await fetchCategorMenuItems()
  } catch (e: any) {
    error.value = e;
  } finally {
    loadingData.value = false;
  }
}

// Watch fetch Employee Active Data when branch changes
watchEffect(async () => {
  if (!selectedBranch.value) return;
  loadingData.value = true;
  await init();
  loadingData.value = false;
});

export function useMenuItems() {
  return { 
    init, 
    data, 
    categories, 
    loadingData, 
    loadingBranches,
    error 
  };
}