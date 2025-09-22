import api from '../api';
import type { EmployeeActive } from '@/types/employeeActive'

/**
 * Fetch timesheet data from backend.
 * Fallback to dummy data if request fails.
 */
export async function fetchEmployeeActive({ filter }: { filter?: Record<string, any> } = {}): Promise<EmployeeActive> {
  try {
    const url = `/employees-activity`;
    const query = new URLSearchParams();
    if (filter) {
      for (const [key, value] of Object.entries(filter)) {
        if (value) {  // Pastikan value valid (tidak null, undefined, atau kosong)
          query.append(key, value);
        }
      }
    }
    const res = await api.get(`${url}?${query.toString()}`);
    return res.data.data;
  } catch (error) {
    console.warn(`API error fetching employee productivity, using dummy data.`, error);
    return { 
      branch: { id: '', name: '' },
      current: 0,
      week: [],
      month: []
     };
  }
}
