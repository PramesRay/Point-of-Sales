import api from '@/services/api';
import dummyFinanceSummary from './dummyFinanceSummary';
import type { FinanceSummary } from '@/types/finance';
import dummyAllIncomes from '@/services/finance/dummyAllIncomes';
import type { AllIncomes } from '@/types/finance';

/**
 * Fetch incomes for all branches.
 * Falls back to dummyAllIncomes if API call fails.
 */
// export async function fetchAllIncomes(): Promise<AllIncomes> {
//   try {
//     const res = await api.get<AllIncomes>('/finance/summary/all/incomes');
//     return res.data;
//   } catch (error) {
//     console.warn('Fetch all incomes failed, using dummy', error);
//     return dummyAllIncomes;
//   }
// }

/**
 * Fetch finance summary for a specific branch.
 * Falls back to dummy data if API call fails.
 */
export async function fetchFinanceSummary({ filter }: { filter?: Record<string, any> } = {}): Promise<FinanceSummary[]> {
  try {
    const url = `/finance-summary`;
    const query = new URLSearchParams();
    if (filter) {
      for (const [key, value] of Object.entries(filter)) {
        if (value) {  // Pastikan value valid (tidak null, undefined, atau kosong)
          query.append(key, value);
        }
      }
    }
    const res = await api.get<FinanceSummary[]>(`${url}?${query.toString()}`);
    return res.data;
  } catch (error) {
    console.warn(`Fetch finance summary failed, using dummy data.`, error);
    let dummy = dummyFinanceSummary;
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
    } else {
      dummy = dummy.filter(item => item.income || item.branch.id === 'all');
    }
    return dummy;
  }
}