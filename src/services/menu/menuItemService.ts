import api from "../api";
import type { Category } from "@/types/inventoryItem";
import type { Menu } from '@/types/menu'
import { dummyMenuCategories } from "./dummyMenuCategories";
import { dummyMenus } from "./dummyMenuItems";

export async function fetchMenuItems(): Promise<Menu[]> {
  try {
    const res = await api.get<Menu[]>(`/kitchen/menus`);
    return res.data;
  } catch (error) {
    console.warn(`Fetch Menu Item failed, using dummy.`, error);
    return dummyMenus
  }  
}

export async function fetchCategorMenuItems(): Promise<Category[]> {
  try {
    const res = await api.get<Category[]>(`/kitchen/menu/category`);
    return res.data;
  } catch (error) {
    console.warn(`Fetch Menu Item's Category failed, using dummy.`, error);
    return dummyMenuCategories
  } 
}