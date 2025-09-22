import api from '@/services/api'
import type {
  StartShiftCashierPayload,
  UpdateShiftCashierPayload,
  StartShiftKitchenPayload,
  UpdateShiftKitchenPayload,
  ShiftCashier,
  ShiftKitchen,
  Shift,
  ShiftWarehouse,
  UpdateShiftWarehousePayload,
  EndShiftCashierPayload,
  ShiftEmployee
} from '@/types/shift'

// Dummy fallback (opsional, bisa kamu isi nanti)
import { dummyShiftCashier } from './dummyShiftCashier'
import { dummyShiftKitchen } from './dummyShiftKitchen'
import { dummyShiftEmployee } from './dummyShiftEmployee'
import { dummyShiftWarehouse } from './dummyShiftWarehouse'

/* ================================
   💼 EMPLOYEE
================================ */

export async function fetchCurrentShiftEmployee({
  branchId,
  page,
  limit,
  search,
  sortBy,
  sortDesc = false,
  filter,
}: {
  branchId?: string
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortDesc?: boolean
  filter?: Record<string, any>
} = {}): Promise<Shift> {
  try {
    const url = `/shift/employee/current`;
    const query = new URLSearchParams();
    
    if (branchId) query.append('branch', branchId)
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

    return res.data.data
  } catch (error) {
    console.warn(`Fetch shift cashier data failed, using dummy.`, error);
    return dummyShiftEmployee[0];
  }
}

export async function fetchShiftEmployee({
  branchId,
  page,
  limit,
  search,
  sortBy,
  sortDesc = false,
  filter,
}: {
  branchId?: string
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortDesc?: boolean
  filter?: Record<string, any>
} = {}): Promise<{data: ShiftEmployee[]; total: number}> {
  try {
    const url = `/shift/employees`;
    const query = new URLSearchParams();
    
    if (branchId) query.append('branch', branchId)
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
      total: res.data.meta?.total ?? res.data.data.length,
    }
  } catch (error) {
    console.warn(`Fetch shift employee data failed, using dummy.`, error);
    let dummy = dummyShiftEmployee;

    // 1. Filter by branch
    if (branchId) {
      dummy = dummy.filter(item => item.branch?.id === branchId)
    }
    
    // 2. Optional: pagination
    if (typeof page === 'number' && typeof limit === 'number') {
      const start = (page - 1) * limit
      dummy = dummy.slice(start, start + limit)
    }

    // 3. Optional: filter
    if (filter) {
      console.log('filter in service', filter)
      for (const [key, value] of Object.entries(filter)) {
        if (value) {  // Pastikan value valid (tidak null, undefined, atau kosong)
          console.log('key', key, 'value', value);

          // Menangani nested key (contoh: 'branch.id')
          const keys = key.split('.'); // Pisahkan key berdasarkan '.'
          console.log('keys', keys);

          dummy = dummy.filter(item => {
            // Iterasi melalui nested keys (misalnya 'branch.id')
            let itemValue: any = item;
            for (const k of keys) {
              console.log('k', k);
              itemValue = itemValue[k];
              console.log('itemValue', itemValue);
              if (itemValue == null) 
                return false; // Jika properti tidak ada, return false
            }
            return itemValue === value;
          });
        }
      }
    }

    
    // 4. Optional: sort
    if (sortBy && dummy.length > 0) {
      console.log('Sorting by', sortBy);
  
      // Pisahkan key jika ada nested key (misalnya branch.name)
      const keys = sortBy.split('.'); // Pisahkan menjadi array berdasarkan titik (.)
      
      dummy = dummy.sort((a, b) => {
        let valA: any = a;
        let valB: any = b;

        // Akses nilai berdasarkan keys
        keys.forEach(key => {
          valA = valA[key];
          valB = valB[key];
        });
        
        // Sorting berdasarkan tipe data (string atau number)
        if (typeof valA === 'string' && typeof valB === 'string') {
          return sortDesc ? valB.localeCompare(valA) : valA.localeCompare(valB);
        }
        
        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortDesc ? valB - valA : valA - valB;
        }
        
        return 0; // Jika tipe data tidak cocok, jangan lakukan sorting
      });
    }
    
    // 5. Search global by string match semua field yang bisa di-string-kan
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

    const total = dummy.length
    return { data: dummy, total }
  }
}

export async function startShiftEmployee(): Promise<Shift> {
  try {
    const res = await api.post<Shift>('/shift/employee/start')
    return res.data
  } catch (error) {
    console.warn('Start shift employee failed.', error)
    throw error
  }
}

export async function endShiftEmployee(): Promise<Shift> {
  try {
    const res = await api.put<Shift>(`/shift/employee/end`)
    return res.data
  } catch (error) {
    console.warn('End shift employee failed.', error)
    throw error
  }
}

/* ================================
   💼 WAREHOUSE
================================ */
export async function fetchCurrentShiftWarehouse({
  branchId,
  page,
  limit,
  search,
  sortBy,
  sortDesc = false,
  filter,
}: {
  branchId?: string
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortDesc?: boolean
  filter?: Record<string, any>
} = {}): Promise<ShiftWarehouse> {
  try {
    const url = `/shift/warehouse/current`;
    const query = new URLSearchParams();
    
    if (branchId) query.append('branch', branchId)
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

    return res.data.data
  } catch (error) {
    console.warn(`Fetch shift cashier data failed, using dummy.`, error);
    return dummyShiftWarehouse[0];
  }
}

export async function fetchShiftWarehouse({
  page,
  limit,
  search,
  sortBy,
  sortDesc = false,
  filter,
}: {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortDesc?: boolean
  filter?: Record<string, any>
} = {}): Promise<{data: ShiftWarehouse[]; total: number}> {
  try {
    const url = `/shift/warehouses`;
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
      total: res.data.meta?.total ?? res.data.data.length,
    }
  } catch (error) {
    console.warn(`Fetch shift warehouse data failed, using dummy.`, error);
    let dummy = dummyShiftWarehouse;
    
    // 2. Optional: pagination
    if (typeof page === 'number' && typeof limit === 'number') {
      const start = (page - 1) * limit
      dummy = dummy.slice(start, start + limit)
    }

    // 3. Optional: filter
    if (filter) {
      console.log('filter in service', filter)
      for (const [key, value] of Object.entries(filter)) {
        if (value) {  // Pastikan value valid (tidak null, undefined, atau kosong)
          console.log('key', key, 'value', value);

          // Menangani nested key (contoh: 'branch.id')
          const keys = key.split('.'); // Pisahkan key berdasarkan '.'
          console.log('keys', keys);

          dummy = dummy.filter(item => {
            // Iterasi melalui nested keys (misalnya 'branch.id')
            let itemValue: any = item;
            for (const k of keys) {
              console.log('k', k);
              itemValue = itemValue[k];
              console.log('itemValue', itemValue);
              if (itemValue == null) 
                return false; // Jika properti tidak ada, return false
            }
            return itemValue === value;
          });
        }
      }
    }

    
    // 4. Optional: sort
    if (sortBy && dummy.length > 0) {
      console.log('Sorting by', sortBy);
  
      // Pisahkan key jika ada nested key (misalnya branch.name)
      const keys = sortBy.split('.'); // Pisahkan menjadi array berdasarkan titik (.)
      
      dummy = dummy.sort((a, b) => {
        let valA: any = a;
        let valB: any = b;

        // Akses nilai berdasarkan keys
        keys.forEach(key => {
          valA = valA[key];
          valB = valB[key];
        });
        
        // Sorting berdasarkan tipe data (string atau number)
        if (typeof valA === 'string' && typeof valB === 'string') {
          return sortDesc ? valB.localeCompare(valA) : valA.localeCompare(valB);
        }
        
        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortDesc ? valB - valA : valA - valB;
        }
        
        return 0; // Jika tipe data tidak cocok, jangan lakukan sorting
      });
    }
    
    // 5. Search global by string match semua field yang bisa di-string-kan
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

    const total = dummy.length
    return { data: dummy, total }
  }
}

export async function startShiftWarehouse(): Promise<ShiftWarehouse> {
  try {
    const res = await api.post<ShiftWarehouse>('/shift/warehouse/start')
    return res.data
  } catch (error) {
    console.warn('Start shift warehouse failed.', error)
    throw error
  }
}

export async function updateShiftWarehouse(payload: UpdateShiftWarehousePayload): Promise<ShiftWarehouse> {
  try {
    const res = await api.put<ShiftWarehouse>(`/shift/warehouse/${payload.id}`, payload)
    return res.data
  } catch (error) {
    console.warn('Update shift warehouse failed.', error)
    throw error
  }
}

export async function endShiftWarehouse(id: string): Promise<ShiftWarehouse> {
  try {
    const res = await api.put<ShiftWarehouse>(`/shift/warehouse/${id}/end`)
    return res.data
  } catch (error) {
    console.warn('End shift warehouse failed.', error)
    throw error
  }
}

/* ================================
   💼 CASHIER
================================ */
export async function fetchCurrentShiftCashier({
  branchId,
  page,
  limit,
  search,
  sortBy,
  sortDesc = false,
  filter,
}: {
  branchId?: string
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortDesc?: boolean
  filter?: Record<string, any>
} = {}): Promise<ShiftCashier> {
  try {
    const url = `/shift/cashier/current`;
    const query = new URLSearchParams();
    
    if (branchId) query.append('branch', branchId)
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

    return res.data.data
  } catch (error) {
    console.warn(`Fetch shift cashier data failed, using dummy.`, error);
    return dummyShiftCashier[0];
  }
}

export async function fetchShiftCashier({
  branchId,
  page,
  limit,
  search,
  sortBy,
  sortDesc = false,
  filter,
}: {
  branchId?: string
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortDesc?: boolean
  filter?: Record<string, any>
} = {}): Promise<{data: ShiftCashier[]; total: number}> {
  try {
    const url = `/shift/cashiers`;
    const query = new URLSearchParams();
    
    if (branchId) query.append('branch', branchId)
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
      total: res.data.meta?.total ?? res.data.data.length,
    }
  } catch (error) {
    console.warn(`Fetch shift cashier data failed, using dummy.`, error);
    let dummy = dummyShiftCashier;

    // 1. Filter by branch
    if (branchId) {
      dummy = dummy.filter(item => item.branch?.id === branchId)
    }
    
    // 2. Optional: pagination
    if (typeof page === 'number' && typeof limit === 'number') {
      const start = (page - 1) * limit
      dummy = dummy.slice(start, start + limit)
    }

    // 3. Optional: filter
    if (filter) {
      console.log('filter in service', filter)
      for (const [key, value] of Object.entries(filter)) {
        if (value) {  // Pastikan value valid (tidak null, undefined, atau kosong)
          console.log('key', key, 'value', value);

          // Menangani nested key (contoh: 'branch.id')
          const keys = key.split('.'); // Pisahkan key berdasarkan '.'
          console.log('keys', keys);

          dummy = dummy.filter(item => {
            // Iterasi melalui nested keys (misalnya 'branch.id')
            let itemValue: any = item;
            for (const k of keys) {
              console.log('k', k);
              itemValue = itemValue[k];
              console.log('itemValue', itemValue);
              if (itemValue == null) 
                return false; // Jika properti tidak ada, return false
            }
            return itemValue === value;
          });
        }
      }
    }
    
    // 4. Optional: sort
    if (sortBy && dummy.length > 0) {
      console.log('Sorting by', sortBy);
  
      // Pisahkan key jika ada nested key (misalnya branch.name)
      const keys = sortBy.split('.'); // Pisahkan menjadi array berdasarkan titik (.)
      
      dummy = dummy.sort((a, b) => {
        let valA: any = a;
        let valB: any = b;

        // Akses nilai berdasarkan keys
        keys.forEach(key => {
          valA = valA[key];
          valB = valB[key];
        });
        
        // Sorting berdasarkan tipe data (string atau number)
        if (typeof valA === 'string' && typeof valB === 'string') {
          return sortDesc ? valB.localeCompare(valA) : valA.localeCompare(valB);
        }
        
        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortDesc ? valB - valA : valA - valB;
        }
        
        return 0; // Jika tipe data tidak cocok, jangan lakukan sorting
      });
    }
    
    // 5. Search global by string match semua field yang bisa di-string-kan
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

    const total = dummy.length
    return { data: dummy, total }
  }
}

export async function startShiftCashier(payload: StartShiftCashierPayload): Promise<ShiftCashier> {
  try {
    const res = await api.post<ShiftCashier>(`/shift/cashier/${payload.branch_id}/start`, payload)
    return res.data
  } catch (error) {
    console.warn('Start shift kasir failed, fallback dummy.', error)
    throw error
  }
}

export async function updateShiftCashier(payload: UpdateShiftCashierPayload): Promise<ShiftCashier> {
  try {
    const res = await api.put<ShiftCashier>(`/shift/cashier/${payload.id}`, payload)
    return res.data
  } catch (error) {
    console.warn('Gagal mengubah data shift kasir', error)
    throw error
  }
}

export async function endShiftCashier(payload: EndShiftCashierPayload): Promise<ShiftCashier> {
  try {
    const res = await api.put<ShiftCashier>(`/shift/cashier/${payload.id}/end`, payload)
    return res.data
  } catch (error) {
    console.warn('Gagal mengakhiri shift kasir', error)
    throw error
  }
}

/* ================================
   🍱 KITCHEN
================================ */
export async function fetchCurrentShiftKitchen({
  branchId,
  page,
  limit,
  search,
  sortBy,
  sortDesc = false,
  filter,
}: {
  branchId?: string
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortDesc?: boolean
  filter?: Record<string, any>
} = {}): Promise<ShiftKitchen> {
  try {
    const url = `/shift/kitchen/current`;
    const query = new URLSearchParams();
    
    if (branchId) query.append('branch', branchId)
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

    return res.data.data
  } catch (error) {
    console.warn(`Fetch shift cashier data failed, using dummy.`, error);
    return dummyShiftKitchen[0];
  }
}

export async function fetchShiftKitchen({
  branchId,
  page,
  limit,
  search,
  sortBy,
  sortDesc = false,
  filter,
}: {
  branchId?: string
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortDesc?: boolean
  filter?: Record<string, any>
} = {}): Promise<{data: ShiftKitchen[]; total: number}> {
  try {
    const url = `/shift/kitchens`;
    const query = new URLSearchParams();
    
    if (branchId) query.append('branch', branchId)
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
      total: res.data.meta?.total ?? res.data.data.length,
    }
  } catch (error) {
    console.warn(`Fetch shift kitchen failed, using dummy.`, error);
    let dummy = dummyShiftKitchen;

    // 1. Filter by branch
    if (branchId) {
      dummy = dummy.filter(item => item.branch?.id === branchId)
    }
    
    // 2. Optional: pagination
    if (typeof page === 'number' && typeof limit === 'number') {
      const start = (page - 1) * limit
      dummy = dummy.slice(start, start + limit)
    }

    // 3. Optional: filter
    if (filter) {
      console.log('filter in service', filter)
      for (const [key, value] of Object.entries(filter)) {
        if (value) {  // Pastikan value valid (tidak null, undefined, atau kosong)
          console.log('key', key, 'value', value);

          // Menangani nested key (contoh: 'branch.id')
          const keys = key.split('.'); // Pisahkan key berdasarkan '.'
          console.log('keys', keys);

          dummy = dummy.filter(item => {
            // Iterasi melalui nested keys (misalnya 'branch.id')
            let itemValue: any = item;
            for (const k of keys) {
              console.log('k', k);
              itemValue = itemValue[k];
              console.log('itemValue', itemValue);
              if (itemValue == null) 
                return false; // Jika properti tidak ada, return false
            }
            return itemValue === value;
          });
        }
      }
    }

    
    // 4. Optional: sort
    if (sortBy && dummy.length > 0) {
      console.log('Sorting by', sortBy);
  
      // Pisahkan key jika ada nested key (misalnya branch.name)
      const keys = sortBy.split('.'); // Pisahkan menjadi array berdasarkan titik (.)
      
      dummy = dummy.sort((a, b) => {
        let valA: any = a;
        let valB: any = b;

        // Akses nilai berdasarkan keys
        keys.forEach(key => {
          valA = valA[key];
          valB = valB[key];
        });
        
        // Sorting berdasarkan tipe data (string atau number)
        if (typeof valA === 'string' && typeof valB === 'string') {
          return sortDesc ? valB.localeCompare(valA) : valA.localeCompare(valB);
        }
        
        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortDesc ? valB - valA : valA - valB;
        }
        
        return 0; // Jika tipe data tidak cocok, jangan lakukan sorting
      });
    }
    
    // 5. Search global by string match semua field yang bisa di-string-kan
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

    const total = dummy.length
    return { data: dummy, total }
  }
}

export async function startShiftKitchen(payload: StartShiftKitchenPayload): Promise<ShiftKitchen> {
  try {
    const res = await api.post<ShiftKitchen>(`/shift/kitchen/${payload.branch_id}/start`, payload)
    return res.data
  } catch (error) {
    console.warn('Start shift dapur failed, fallback dummy.', error)
    throw error
  }
}

export async function updateShiftKitchen(payload: UpdateShiftKitchenPayload | Omit<UpdateShiftKitchenPayload, 'notes'>): Promise<ShiftKitchen> {
  try {
    const res = await api.put<ShiftKitchen>(`/shift/kitchen/${payload.id}`, payload)
    return res.data
  } catch (error) {
    console.warn('End shift dapur failed, fallback dummy.', error)
    throw error
  }
}

export async function qtyMenuUpdate(payload: Omit<UpdateShiftKitchenPayload, 'notes'>): Promise<void> {
  try {
    const res = await api.put(`/shift/kitchen/${payload.id}/manage-qty`, payload);
    return res.data;
  } catch (error) {
    console.error('Failed to restock menu:', error);
    throw error;
  }
}

export async function endShiftKitchen(id: string): Promise<ShiftKitchen> {
  try {
    const res = await api.put<ShiftKitchen>(`/shift/kitchen/${id}/end`)
    return res.data
  } catch (error) {
    console.warn('End shift dapur failed, fallback dummy.', error)
    throw error
  }
}