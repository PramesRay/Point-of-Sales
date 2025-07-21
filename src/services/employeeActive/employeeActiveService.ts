import api from '../api';
import dummyEmployeeActive from './dummyEmployeeActive';
import type { EmployeeActive } from '@/types/employeeActive'

/**
 * Fetch timesheet data from backend.
 * Fallback to dummy data if request fails.
 */
export async function fetchEmployeeActive(branch?: string): Promise<EmployeeActive[]> {
  try {
    const response = await api.get<EmployeeActive[]>(`/employee-active/${encodeURIComponent(branch ?? '')}`);
    return response.data;
  } catch (error) {
    console.warn(`API error fetching timesheet for "${branch}", using dummy data.`, error);
    if (!branch) return dummyEmployeeActive
    return dummyEmployeeActive.filter(tx => tx.branch.id === branch);
  }
}
