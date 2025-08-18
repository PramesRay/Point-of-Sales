/**
 * Helper untuk mengolah data dummy (pagination, filter, sort, search)
 */
export function processDummyData(
  data: any[],
  options: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortDesc?: boolean;
    filter?: Record<string, any>;
  }
): { data: any[]; total: number } {
  let result = [...data];

  // Optional: pagination
  if (typeof options.page === 'number' && typeof options.limit === 'number') {
    const start = (options.page - 1) * options.limit
    data = data.slice(start, start + options.limit)
  }

  // 3. Optional: filter
  if (options.filter) {
    console.log('filter in service', options.filter)
    for (const [key, value] of Object.entries(options.filter)) {
      if (value) {  // Pastikan value valid (tidak null, undefined, atau kosong)
        console.log('key', key);
        console.log('value', value);
        console.log('value type', typeof value);

        // Menangani nested key (contoh: 'branch.id')
        const keys = key.split('.'); // Pisahkan key berdasarkan '.'
        console.log('keys', keys);

        data = data.filter(item => {
          let itemValue: any = item;
          for (const k of keys) {
            itemValue = itemValue?.[k];
            if (itemValue === undefined || itemValue === null) {
              return false;
            }
          }

          // Jika itemValue adalah array, cek apakah ada elemen yang match dengan value
          if (Array.isArray(itemValue)) {
            return itemValue.some(arrItem => {
              // Jika value juga object, lakukan deep compare
              if (typeof value === 'object' && !Array.isArray(value)) {
                return JSON.stringify(arrItem) === JSON.stringify(value);
              }
              // Jika value adalah primitive, cek langsung
              return arrItem === value;
            });
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
        console.log('data', data);
      }
    }
  }

  
  // 4. Optional: sort
  if (options.sortBy && data.length > 0) {
    console.log('Sorting by', options.sortBy);

    // Pisahkan key jika ada nested key (misalnya branch.name)
    const keys = options.sortBy.split('.'); // Pisahkan menjadi array berdasarkan titik (.)
    
    data = data.sort((a, b) => {
      let valA: any = a;
      let valB: any = b;

      // Akses nilai berdasarkan keys
      keys.forEach(key => {
        valA = valA[key];
        valB = valB[key];
      });
      
      // Sorting berdasarkan tipe data (string atau number)
      if (typeof valA === 'string' && typeof valB === 'string') {
        return options.sortDesc ? valB.localeCompare(valA) : valA.localeCompare(valB);
      }
      
      if (typeof valA === 'number' && typeof valB === 'number') {
        return options.sortDesc ? valB - valA : valA - valB;
      }
      
      return 0; // Jika tipe data tidak cocok, jangan lakukan sorting
    });
  }
  
  // 5. Search global by string match semua field yang bisa di-string-kan
  if (options.search) {
    const keyword = options.search.toLowerCase()
    data = data.filter(item =>
      Object.values(item).some(val => {
        if (val == null) return false
        if (typeof val === 'object') return JSON.stringify(val).toLowerCase().includes(keyword)
        return String(val).toLowerCase().includes(keyword)
      })
    )
  }

  // Pagination
  const total = result.length;
  if (options.page && options.limit) {
    const start = (options.page - 1) * options.limit;
    const end = start + options.limit;
    result = result.slice(start, end);
  }

  return { data: result, total };
}