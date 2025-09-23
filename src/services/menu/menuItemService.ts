import api from "../api";
import type { Category } from "@/types/inventory";
import type { Menu } from '@/types/menu'

export async function fetchMenuSales(branchId?: string): Promise<Menu[]> {
  try {
    const url = '/menu-sales'
    const query = new URLSearchParams()

    if (branchId) query.append('branch_id', branchId)
    
    const res = await api.get(`${url}?${query.toString()}`)

    return res.data.data
  } catch (error) {
    console.warn('Fetch Menu Item failed, using dummy.', error)
    return []
  }
}

export async function fetchCategorMenu(): Promise<Category[]> {
  try {
    const res = await api.get(`/categories?type=menu`);
    return res.data.data;
  } catch (error) {
    console.warn(`Fetch Menu Item's Category failed, using dummy.`, error);
    return []
  }
}