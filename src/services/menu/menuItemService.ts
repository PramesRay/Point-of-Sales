import api from "../api";
import type { Category, CreateCategoryPayload, UpdateCategoryPayload } from "@/types/inventory";
import type { CreateMenuPayload, Menu, MenuSale, UpdateMenuPayload } from '@/types/menu'

export async function fetchMenus(
  branchId?: string,
  page?: number,
  limit?: number,
  search?: string,
  sortBy?: string,
  sortDesc: boolean = false
): Promise<{ data: Menu[]; total: number }> {
  try {
    const url = `/menus`
    const query = new URLSearchParams()

    if (branchId) query.append('branch_id', branchId)
    if (search) query.append('search', search)
    if (sortBy) query.append('sort', `${sortBy}:${sortDesc ? 'desc' : 'asc'}`)
    if (typeof page === 'number') query.append('page', page.toString())
    if (typeof limit === 'number') query.append('limit', limit.toString())

    const res = await api.get(`${url}?${query.toString()}`)

    return {
      data: res.data.data,
      total: res.data.meta?.total ?? res.data.data.length,
    }
  } catch (error) {
    console.warn('Fetch Menu Item failed, using dummy.', error)
    return { data: [], total: 0 }
  }
}

export async function fetchMenusales(
  branchId?: string,
  page?: number,
  limit?: number,
  search?: string,
  sortBy?: string,
  sortDesc: boolean = false
): Promise<{ data: MenuSale[]; total: number }> {
  try {
    const url = `/menu-sales`
    const query = new URLSearchParams()

    if (branchId) query.append('branch_id', branchId)
    if (search) query.append('search', search)
    if (sortBy) query.append('sort', `${sortBy}:${sortDesc ? 'desc' : 'asc'}`)
    if (typeof page === 'number') query.append('page', page.toString())
    if (typeof limit === 'number') query.append('limit', limit.toString())

    const res = await api.get(`${url}?${query.toString()}`)

    return {
      data: res.data.data,
      total: res.data.meta?.total ?? res.data.data.length,
    }
  } catch (error) {
    console.warn('Fetch Menu Item failed, using dummy.', error)
    return { data: [], total: 0 }
  }
}

export async function createMenu(menu: CreateMenuPayload): Promise<Menu> {
  try {
    const res = await api.post<Menu>('/menu', menu);
    return res.data;
  } catch (error) {
    console.error('Failed to create menu:', error);
    throw error;
  }
}

export async function updateMenu(menu: UpdateMenuPayload): Promise<Menu> {
  try {
    const res = await api.put<Menu>(`/menu/${menu.id}`, menu);
    return res.data;
  } catch (error) {
    console.error('Failed to update menu:', error);
    throw error;
  }
}

export async function deleteMenu(id: string): Promise<void> {
  try {
    await api.delete(`/menu/${id}`);
  } catch (error) {
    console.error('Failed to delete menu:', error);
    throw error;
  }
}

export async function fetchCategorMenu(id?: string): Promise<Category[]> {
  try {
    const query = new URLSearchParams();

    if (id) query.append('branch_id', id);
    query.append('type', 'menu');
    const res = await api.get(`/categories?${query.toString()}`);
    return res.data.data;
  } catch (error) {
    console.warn(`Fetch Menu Item's Category failed, using dummy.`, error);
    return [];
  }
}

// create category
export async function createCategoryMenu(payload: CreateCategoryPayload): Promise<Category> {
  try {
    const res = await api.post<Category>(`/category?type=menu`, payload);
    return res.data;
  } catch (error) {
    console.error('Failed to create category:', error);
    throw error;
  }
}

// update category
export async function updateCategoryMenu(payload: UpdateCategoryPayload): Promise<Category> {
  try {
    const res = await api.put<Category>(`/category/${payload.id}`, payload);
    return res.data;
  } catch (error) {
    console.error('Failed to update category:', error);
    throw error;
  }
}

// delete category
export async function deleteCategoryMenu(id: string): Promise<void> {
  try {
    await api.delete(`/category/${id}`);
  } catch (error) {
    console.error('Failed to delete category:', error);
    throw error;
  }
}