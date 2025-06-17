import api from "../api";
import { dummyInventoryItems } from "./dummyInventoryItems";
import type { Category, CreateStockMovementPayload, InventoryItem, StockMovement, UpdateStockMovementPayload } from "@/types/inventory";
import { dummyInventoryItemsCategories } from "./dummyInventoryItemsCategory";
import { dummyStockMovements } from "./dummyStockMovements";
import type { CreateInventoryItemPayload, UpdateInventoryItemPayload } from "@/types/inventory";
import { useAlertStore } from "@/stores/alert";

const alertStore = useAlertStore();

export async function fetchInventoryItem(): Promise<InventoryItem[]> {
  try {
    const res = await api.get<InventoryItem[]>(`/inventory/items`);
    return res.data;
  } catch (error) {
    console.warn(`Fetch Inventory Item failed, using dummy.`, error);
    return dummyInventoryItems
  }  
}

export async function fetchCategoryInventoryItems(): Promise<Category[]> {
  try {
    const res = await api.get<Category[]>(`/inventory/category`);
    return res.data;
  } catch (error) {
    console.warn(`Fetch Inventory Item's Category failed, using dummy.`, error);
    return dummyInventoryItemsCategories
  } 
}

export async function fetchStockMovements(): Promise<StockMovement[]> {
  try {
    const res = await api.get<StockMovement[]>(`/inventory/stock-movements`);
    return res.data;
  } catch (error) {
    console.warn(`Fetch Stock Movements failed, using dummy.`, error);
    return dummyStockMovements
  }  
}

export async function createStockMovement(payload: CreateStockMovementPayload): Promise<StockMovement> {
  try {
    const res = await api.post<StockMovement>(`/inventory/stock-movements`, payload);
    alertStore.showAlert('Stock Movement berhasil dibuat!', 'success');
    return res.data;
  } catch (error) {
    alertStore.showAlert('Stock Movement gagal dibuat!', 'error');
    console.warn(`Create stock movement failed, using dummy.`, error);
    throw error
  }
}

export async function updateStockMovement(payload: UpdateStockMovementPayload): Promise<StockMovement> {
  try {
    const res = await api.put<StockMovement>(`/inventory/stock-movements`, payload);
    alertStore.showAlert('Stock Movement berhasil diubah!', 'success');
    return res.data;
  } catch (error) {
    alertStore.showAlert('Stock Movement gagal diubah!', 'error');
    console.warn(`Update stock movement failed, using dummy.`, error);
    throw error
  }
}

export async function createItem(payload: CreateInventoryItemPayload): Promise<InventoryItem> {
  try {
    const res = await api.post<InventoryItem>(`/inventory/items`, payload);
    alertStore.showAlert('Item berhasil dibuat!', 'success');
    return res.data;
  } catch (error) {
    alertStore.showAlert('Item gagal dibuat!', 'error');
    console.warn(`Create item failed, using dummy.`, error);
    throw error
  }  
}

export async function updateItem(payload: UpdateInventoryItemPayload): Promise<InventoryItem> {
  try {
    const res = await api.put<InventoryItem>(`/inventory/items`, payload);
    alertStore.showAlert('Item berhasil diubah!', 'success');
    return res.data;
  } catch (error) {
    alertStore.showAlert('Item gagal diubah!', 'error');
    console.warn(`Update item failed, using dummy.`, error);
    throw error
  }  
}

export async function deleteItem(id: string): Promise<void> {
  try {
    await api.delete(`/inventory/items/${id}`);
    alertStore.showAlert('Item berhasil dihapus!', 'success');
  } catch (error) {
    alertStore.showAlert('Item gagal dihapus!', 'error');
    console.warn(`Delete item failed, using dummy.`, error);
    throw error
  }  
}