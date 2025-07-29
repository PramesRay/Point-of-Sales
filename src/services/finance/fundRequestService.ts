import api from '@/services/api';
import dummyFundRequestData from '@/services/finance/dummyFundRequest';
import type { ApproveFundRequest, CreateFundRequest, FundRequest, UpdateFundRequest } from '@/types/finance';
import branchList from '@/services/common/branch/dummyBranchList'; 
import { useAlertStore } from '@/stores/alert';

const alertStore = useAlertStore();

/**
 * Fetch fund requests for a branch or all if branchId === 'all'.
 */
export async function fetchFundRequests({
    page,
    limit,
    search,
    sortBy,
    sortDesc,
    filter
  }: {
    page?: number
    limit?: number
    search?: string
    sortBy?: string
    sortDesc?: boolean
    filter?: Record<string, any>
  } = {}): Promise<{data: FundRequest[]; total: number}> {
    try {
      const url = `/fund-request`;
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
      console.warn(`Fetch Fund Request data failed, using dummy.`, error);
      let dummy = dummyFundRequestData;
      
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
            console.log('key', key);
            console.log('value', value);
            console.log('value type', typeof value);
  
            // Menangani nested key (contoh: 'branch.id')
            const keys = key.split('.'); // Pisahkan key berdasarkan '.'
            console.log('keys', keys);
  
            dummy = dummy.filter(item => {
              let itemValue: any = item;
              for (const k of keys) {
                itemValue = itemValue?.[k];
                if (itemValue === undefined || itemValue === null) {
                  return false;
                }
              }

              // Jika value berupa array, gunakan includes
              if (Array.isArray(value)) {
                return value.includes(itemValue);
              }

              // Jika value berupa object, gunakan deep comparison
              if (typeof value === 'object') {
                return JSON.stringify(itemValue) === JSON.stringify(value);
              }

              // Jika value berupa date, gunakan perbandingan tanggal saja
              if ((value instanceof Date && !isNaN(value.getTime())) || typeof value === 'string') {
                // Jika value adalah string, kita konversi menjadi Date
                const parsedValue = typeof value === 'string' ? new Date(value) : value;

                if ((itemValue instanceof Date && !isNaN(itemValue.getTime())) || typeof itemValue === 'string') {
                  // Jika itemValue adalah string, kita konversi menjadi Date
                  const parsedItemValue = typeof itemValue === 'string' ? new Date(itemValue) : itemValue;

                  // Ambil tanggal saja (YYYY-MM-DD) untuk perbandingan
                  const itemDate = parsedItemValue.toISOString().split('T')[0];  // Hanya tanggal (YYYY-MM-DD)
                  console.log('itemDate', itemDate);

                  const filterDate = parsedValue.toISOString().split('T')[0];  // Hanya tanggal (YYYY-MM-DD)
                  console.log('filterDate', filterDate);

                  return itemDate === filterDate;  // Bandingkan tanggal tanpa waktu
                } else {
                  console.log("itemValue is not a valid Date or string.");
                }
              } else {
                console.log("value is not a valid Date or string.");
              }

              // Jika bukan array, gunakan perbandingan biasa
              return itemValue === value;
            });
            console.log('dummy', dummy);
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

export async function createFundRequest(payload: CreateFundRequest): Promise<FundRequest> {
  try {
    const res = await api.post<FundRequest>(`/finance/fund-requests`, payload);
    alertStore.showAlert('Permintaan Dana berhasil dibuat!', 'success');
    return res.data;
  } catch (error) {
    alertStore.showAlert('Permintaan Dana gagal dibuat!', 'error');
    console.warn(`Create fund request failed, using dummy.`, error);
    throw error
  }
}

export async function updateFundRequest(payload: UpdateFundRequest | ApproveFundRequest): Promise<FundRequest> {
  try {
    const res = await api.put<FundRequest>(`/finance/fund-requests`, payload);
    alertStore.showAlert(`Permintaan Dana ${payload.id} berhasil diubah!`, 'success');
    return res.data;
  } catch (error) {
    alertStore.showAlert(`Permintaan Dana ${payload.id} berhasil diubah!`, 'error');
    console.warn(`Update fund request failed, using dummy.`, error);
    throw error
  }
}

export async function deleteFundRequest(id: string): Promise<void> {
  try {
    await api.delete(`/finance/fund-requests/${id}`);
    alertStore.showAlert(`Permintaan Dana ${id} berhasil dihapus!`, 'success');
  } catch (error) {
    alertStore.showAlert(`Permintaan Dana ${id} gagal dihapus!`, 'error');
    console.warn(`Delete fund request failed, using dummy.`, error);
    throw error
  }
}