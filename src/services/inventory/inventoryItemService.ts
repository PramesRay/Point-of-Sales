import api from "../api";
import type { Category, CreateCategoryPayload, CreateStockMovementPayload, InventoryItem, StockMovement, UpdateCategoryPayload, UpdateStockMovementPayload } from "@/types/inventory";
import type { CreateInventoryItemPayload, UpdateInventoryItemPayload } from "@/types/inventory";
import { useAlertStore } from "@/stores/alert";

const alertStore = useAlertStore();

export async function fetchInventoryItem(): Promise<InventoryItem[]> {
  try {
    const res = await api.get(`/inventory/items`);
    return res.data.data;
  } catch (error) {
    console.warn(`Fetch Inventory Item failed, using dummy.`, error);
    return [];
  }  
}

export async function fetchStockMovements({
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
  } = {}): Promise<{data: StockMovement[]; total: number}> {
  try {
    const url = `/inventory/stock-movements`;
    const query = new URLSearchParams();
    
    if (search) query.append('search', search)
    if (sortBy) query.append('sort', `${sortBy}:${sortDesc ? 'desc' : 'asc'}`)
    if (typeof page === 'number') query.append('page', page.toString())
    if (typeof limit === 'number') query.append('limit', limit.toString())

    if (filter) {
      for (const [key, value] of Object.entries(filter)) {
        if (value) {  // Pastikan value valid (tidak null, undefined, atau kosong)
          query.append(key, value);
        }
      }
    }

    const res = await api.get(`${url}?${query.toString()}`)

    return {
      data: res.data.data,
      total: res.data.data.meta?.total ?? res.data.data.length,
    }
  } catch (error) {
    console.warn(`Fetch Stock Movement data failed, using dummy.`, error);
    return { data: [], total: 0 };
  }
}

export async function createStockMovement(payload: CreateStockMovementPayload): Promise<StockMovement> {
  try {
    const res = await api.post(`/inventory/stock-movement`, payload);
    alertStore.showAlert('Stock Movement berhasil dibuat!', 'success');
    return res.data.data;
  } catch (error) {
    alertStore.showAlert('Stock Movement gagal dibuat!', 'error');
    console.warn(`Create stock movement failed, using dummy.`, error);
    throw error
  }
}

export async function updateStockMovement(payload: UpdateStockMovementPayload): Promise<StockMovement> {
  try {
    const res = await api.put(`/inventory/stock-movement`, payload);
    alertStore.showAlert('Stock Movement berhasil diubah!', 'success');
    return res.data.data;
  } catch (error) {
    alertStore.showAlert('Stock Movement gagal diubah!', 'error');
    console.warn(`Update stock movement failed, using dummy.`, error);
    throw error
  }
}

export async function deleteStockMovement(id: string): Promise<void> {
  try {
    await api.delete(`/inventory/stock-movement/${id}`);
    alertStore.showAlert('Stock Movement berhasil dihapus!', 'success');
  } catch (error) {
    alertStore.showAlert('Stock Movement gagal dihapus!', 'error');
    console.warn(`Delete stock movement failed.`, error);
    throw error
  }  
}

export async function createItem(payload: CreateInventoryItemPayload): Promise<InventoryItem> {
  try {
    const res = await api.post(`/inventory/item`, payload);
    alertStore.showAlert('Item berhasil dibuat!', 'success');
    return res.data.data;
  } catch (error) {
    alertStore.showAlert('Item gagal dibuat!', 'error');
    console.warn(`Create item failed, using dummy.`, error);
    throw error
  }  
}

export async function updateItem(payload: UpdateInventoryItemPayload): Promise<InventoryItem> {
  try {
    const res = await api.put(`/inventory/item`, payload);
    alertStore.showAlert('Item berhasil diubah!', 'success');
    return res.data.data;
  } catch (error) {
    alertStore.showAlert('Item gagal diubah!', 'error');
    console.warn(`Update item failed, using dummy.`, error);
    throw error
  }  
}

export async function deleteItem(id: string): Promise<void> {
  try {
    await api.delete(`/inventory/item/${id}`);
    alertStore.showAlert('Item berhasil dihapus!', 'success');
  } catch (error) {
    alertStore.showAlert('Item gagal dihapus!', 'error');
    console.warn(`Delete item failed, using dummy.`, error);
    throw error
  }  
}

export async function fetchCategoryInvItem(): Promise<Category[]> {
  try {
    const res = await api.get(`/categories?type=inv`);
    return res.data.data;
  } catch (error) {
    console.warn(`Fetch Inventory Item's Category failed, using dummy.`, error);
    return [];
  } 
}

export async function createCategoryInvItem(payload: CreateCategoryPayload): Promise<Category> {
  try {
    const res = await api.post(`/category?type=inv`, payload);
    alertStore.showAlert('Category berhasil dibuat!', 'success');
    return res.data.data;
  } catch (error) {
    alertStore.showAlert('Category gagal dibuat!', 'error');
    console.warn(`Create category failed, using dummy.`, error);
    throw error
  }  
}

export async function updateCategoryInvItem(payload: UpdateCategoryPayload): Promise<Category> {
  try {
    const res = await api.put(`/category?type=inv`, payload);
    alertStore.showAlert('Category berhasil diubah!', 'success');
    return res.data.data;
  } catch (error) {
    alertStore.showAlert('Category gagal diubah!', 'error');
    console.warn(`Update category failed, using dummy.`, error);
    throw error
  }  
}

export async function deleteCategoryInvItem(id: string): Promise<void> {
  try {
    await api.delete(`/category/${id}`);
    alertStore.showAlert('Category berhasil dihapus!', 'success');
  } catch (error) {
    alertStore.showAlert('Category gagal dihapus!', 'error');
    console.warn(`Delete category failed, using dummy.`, error);
    throw error
  }  
}