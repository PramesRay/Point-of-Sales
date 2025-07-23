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
  UpdateShiftWarehousePayload
} from '@/types/shift'

// Dummy fallback (opsional, bisa kamu isi nanti)
import { dummyShiftCashier } from './dummyShiftCashier'
import { dummyShiftKitchen } from './dummyShiftKitchen'
import { dummyShiftEmployee } from './dummyShiftEmployee'
import { dummyShiftWarehouse } from './dummyShiftWarehouse'

/* ================================
   💼 EMPLOYEE
================================ */

export async function fetchShiftEmployee(
  branchId?: string,
  page?: number,
  limit?: number,
  search?: string,
  sortBy?: string,
  sortDesc: boolean = false,
  filter?: Record<string, any>
): Promise<{data: Shift[]; total: number}> {
  try {
    const url = `/shift/employee`;
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
      dummy = dummy.filter(item => item.branch.id === branchId)
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

export async function startShiftEmployee(branch_id: string): Promise<Shift> {
  try {
    const res = await api.post<Shift>('/shift/employee', branch_id)
    return res.data
  } catch (error) {
    console.warn('Start shift employee failed.', error)
    throw error
  }
}

export async function endShiftEmployee(id: string): Promise<Shift> {
  try {
    const res = await api.put<Shift>(`/shift/employee/end/${id}`)
    return res.data
  } catch (error) {
    console.warn('End shift employee failed.', error)
    throw error
  }
}

/* ================================
   💼 WAREHOUSE
================================ */

export async function fetchShiftWarehouse(
  page?: number,
  limit?: number,
  search?: string,
  sortBy?: string,
  sortDesc: boolean = false,
  filter?: Record<string, any>
): Promise<{data: ShiftWarehouse[]; total: number}> {
  try {
    const url = `/shift/employee`;
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
    const res = await api.post<ShiftWarehouse>('/shift/warehouse')
    return res.data
  } catch (error) {
    console.warn('Start shift employee failed.', error)
    throw error
  }
}

export async function updateShiftWarehouse(payload: UpdateShiftWarehousePayload): Promise<ShiftWarehouse> {
  try {
    const res = await api.put<ShiftWarehouse>(`/shift/warehouse/${payload.id}`, payload)
    return res.data
  } catch (error) {
    console.warn('Update shift employee failed.', error)
    throw error
  }
}

export async function endShiftWarehouse(id: string): Promise<ShiftWarehouse> {
  try {
    const res = await api.put<ShiftWarehouse>(`/shift/employee/end/${id}`)
    return res.data
  } catch (error) {
    console.warn('End shift employee failed.', error)
    throw error
  }
}

/* ================================
   💼 CASHIER
================================ */

export async function fetchShiftCashier(
  branchId?: string,
  page?: number,
  limit?: number,
  search?: string,
  sortBy?: string,
  sortDesc: boolean = false,
  filter?: Record<string, any>
): Promise<{data: ShiftCashier[]; total: number}> {
  try {
    const url = `/shift/cashier`;
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
      dummy = dummy.filter(item => item.branch.id === branchId)
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
    const res = await api.post<ShiftCashier>('/shift/cashier', payload)
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

export async function endShiftCashier(payload: UpdateShiftCashierPayload): Promise<ShiftCashier> {
  try {
    const res = await api.put<ShiftCashier>(`/shift/cashier/end/${payload.id}`, payload)
    return res.data
  } catch (error) {
    console.warn('Gagal mengakhiri shift kasir', error)
    throw error
  }
}

/* ================================
   🍱 KITCHEN
================================ */

export async function fetchShiftKitchen(
  branchId?: string,
  page?: number,
  limit?: number,
  search?: string,
  sortBy?: string,
  sortDesc: boolean = false,
  filter?: Record<string, any>
): Promise<{data: ShiftKitchen[]; total: number}> {
  try {
    const url = `/shift/kitchen`;
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
      dummy = dummy.filter(item => item.branch.id === branchId)
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
    const res = await api.post<ShiftKitchen>('/shift/kitchen', payload)
    return res.data
  } catch (error) {
    console.warn('Start shift dapur failed, fallback dummy.', error)
    throw error
  }
}

export async function updateShiftKitchen(payload: UpdateShiftKitchenPayload): Promise<ShiftKitchen> {
  try {
    const res = await api.put<ShiftKitchen>(`/shift/kitchen/${payload.id}`, payload)
    return res.data
  } catch (error) {
    console.warn('End shift dapur failed, fallback dummy.', error)
    throw error
  }
}

export async function endShiftKitchen(payload: UpdateShiftKitchenPayload): Promise<ShiftKitchen> {
  try {
    const res = await api.put<ShiftKitchen>(`/shift/kitchen/end/${payload.id}`, payload)
    return res.data
  } catch (error) {
    console.warn('End shift dapur failed, fallback dummy.', error)
    throw error
  }
}