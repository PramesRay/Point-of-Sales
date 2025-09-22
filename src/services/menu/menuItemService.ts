import api from "../api";
import type { Category, CreateCategoryPayload, UpdateCategoryPayload } from "@/types/inventory";
import type { CreateMenuPayload, Menu, MenuSale, RestockMenuSalesPayload, UpdateMenuPayload } from '@/types/menu'
import { dummyMenuCategories } from "./dummyMenuCategories";
import { dummyMenuSale } from "./dummyMenuSale";

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
    let dummy = dummyMenuSale

    // 1. Filter by branch
    if (branchId) {
      dummy = dummy.filter(item =>
        item.branch.id === branchId
      )
    }

    // 2. Search global by string match semua field yang bisa di-string-kan
    if (search) {
      const keyword = search.toLowerCase()
      dummy = dummy.filter(item =>
        Object.values(item).some(val => {
          if (val == null) return false
          if (typeof val === 'object') return JSON.stringify(val).toLowerCase().includes(keyword)
          return String(val).toLowerCase().includes(keyword)
        })
      )
    }

    // 3. Optional: sort
    if (sortBy && dummy.length > 0 && Object.prototype.hasOwnProperty.call(dummy[0], sortBy)) {
      dummy = dummy.sort((a, b) => {
        const valA = a[sortBy as keyof Menu]
        const valB = b[sortBy as keyof Menu]

        if (typeof valA === 'string' && typeof valB === 'string') {
          return sortDesc ? valB.localeCompare(valA) : valA.localeCompare(valB)
        }

        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortDesc ? valB - valA : valA - valB
        }

        return 0
      })
    }


    const total = dummy.length

    // 4. Optional: pagination
    if (typeof page === 'number' && typeof limit === 'number') {
      const start = (page - 1) * limit
      dummy = dummy.slice(start, start + limit)
    }

    return { data: dummy, total }
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
    let dummy = dummyMenuSale

    // 1. Filter by branch
    if (branchId) {
      dummy = dummy.filter(item =>
        item.branch.id === branchId
      )
    }

    // 2. Search global by string match semua field yang bisa di-string-kan
    if (search) {
      const keyword = search.toLowerCase()
      dummy = dummy.filter(item =>
        Object.values(item).some(val => {
          if (val == null) return false
          if (typeof val === 'object') return JSON.stringify(val).toLowerCase().includes(keyword)
          return String(val).toLowerCase().includes(keyword)
        })
      )
    }

    // 3. Optional: sort
    if (sortBy && dummy.length > 0 && Object.prototype.hasOwnProperty.call(dummy[0], sortBy)) {
      dummy = dummy.sort((a, b) => {
        const valA = a[sortBy as keyof Menu]
        const valB = b[sortBy as keyof Menu]

        if (typeof valA === 'string' && typeof valB === 'string') {
          return sortDesc ? valB.localeCompare(valA) : valA.localeCompare(valB)
        }

        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortDesc ? valB - valA : valA - valB
        }

        return 0
      })
    }


    const total = dummy.length

    // 4. Optional: pagination
    if (typeof page === 'number' && typeof limit === 'number') {
      const start = (page - 1) * limit
      dummy = dummy.slice(start, start + limit)
    }

    return { data: dummy, total }
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
    return dummyMenuCategories; // Gunakan data dummy jika gagal
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