import api from "@/services/api";
import dummyEmployee from "../employee/dummyEmployee";
import type { CreateEmployeePayload, Employee, UpdateEmployeeByEmployee, UpdateEmployeePayloadByOwner } from "@/types/employee";

export async function fetchUsers(
  branchId?: string,
  page?: number,
  limit?: number,
  search?: string,
  sortBy?: string,
  sortDesc: boolean = false,
  filter?: Record<string, any>
): Promise<{data: Employee[]; total: number}> {
  try {
    const url = `/users`;
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
    console.warn(`Fetch users in "${branchId}" failed, using dummy.`, error);
    let dummy = dummyEmployee;

    // 1. Filter by branch
    if (branchId) {
      dummy = dummy.filter(item => item.assigned_branch.some(branch => branch.id === branchId));
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

export async function createUser(payload: CreateEmployeePayload): Promise<Employee> {
  try {
    const res = await api.post<Employee>('/users', payload);
    return res.data;
  } catch (error) {
    console.error('Failed to create user:', error);
    throw error;
  }
}

export async function updateUser(payload: UpdateEmployeePayloadByOwner | UpdateEmployeeByEmployee): Promise<Employee> {
  try {
    const res = await api.patch<Employee>(`/users/${payload.id}`, payload);
    return res.data;
  } catch (error) {
    console.error('Failed to update user:', error);
    throw error;
  }
}

export async function deleteUser(id: string): Promise<void> {
  try {
    await api.delete(`/users/${id}`);
  } catch (error) {
    console.error('Failed to delete user:', error);
    throw error;
  }
}