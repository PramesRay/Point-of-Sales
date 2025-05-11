import api from "../api";
import { dummyInventoryItems } from "./dummyInventoryItems";
import type { InventoryCategory, InventoryItem } from "@/types/inventoryItem";
import { dummyInventoryItemsCategories } from "./dummyInventoryItemsCategory";

export async function fetchInventoryItem(): Promise<InventoryItem[]> {
  try {
    const res = await api.get<InventoryItem[]>(`/inventory/items`);
    return res.data;
  } catch (error) {
    console.warn(`Fetch Inventory Item failed, using dummy.`, error);
    return dummyInventoryItems
  }  
}

export async function fetchCategoryInventoryItems(): Promise<InventoryCategory[]> {
  try {
    const res = await api.get<InventoryCategory[]>(`/inventory/category`);
    return res.data;
  } catch (error) {
    console.warn(`Fetch Inventory Item's Category failed, using dummy.`, error);
    return dummyInventoryItemsCategories
  } 
}