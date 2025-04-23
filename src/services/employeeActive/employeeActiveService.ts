import api from '../api';
import dummyEmployeeActive from './dummyEmployeeActive';
import type { EmployeeActive } from '@/types/employeeActive'

/**
 * Fetch timesheet data from backend.
 * Fallback to dummy data if request fails.
 */
export async function fetchEmployeeActive(restaurant: string): Promise<EmployeeActive> {
  try {
    console.log(`Fetching timesheet data for restaurant: ${restaurant}`); // Debugging
    const response = await api.get<EmployeeActive>(`/employee-active/${encodeURIComponent(restaurant)}`);
    console.log('API Response:', response.data); // Debugging
    return response.data;
  } catch (error) {
    console.warn(`API error fetching timesheet for "${restaurant}", using dummy data.`, error);
    const fallback = dummyEmployeeActive[restaurant];
    if (!fallback) {
      throw new Error(`No dummy data available for restaurant "${restaurant}"`);
    }
    console.log('Using fallback data:', fallback); // Debugging
    return fallback;
  }
}
