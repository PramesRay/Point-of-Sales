import api from "../api";
import { dummyInventoryItems } from "./dummyInventoryItems";
import type { Category, InventoryItem, StockMovement } from "@/types/inventoryItem";
import { dummyInventoryItemsCategories } from "./dummyInventoryItemsCategory";
import { dummyStockMovements } from "./dummyStockMovements";

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