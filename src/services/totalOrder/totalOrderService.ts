import api from '../api';
import dummyTotalOrder from './dummyTotalOrder';
import type { TotalOrder } from '@/types/totalOrder'

/**
 * Fetch timesheet data from backend.
 * Fallback to dummy data if request fails.
 */
export async function fetchTotalOrder(restaurant: string): Promise<TotalOrder> {
  try {
    console.log(`Fetching timesheet data for restaurant: ${restaurant}`); // Debugging
    const response = await api.get<TotalOrder>(`/total-order/${encodeURIComponent(restaurant)}`);
    console.log('API Response:', response.data); // Debugging
    return response.data;
  } catch (error) {
    console.warn(`API error fetching timesheet for "${restaurant}", using dummy data.`, error);
    const fallback = dummyTotalOrder[restaurant];
    if (!fallback) {
      throw new Error(`No dummy data available for restaurant "${restaurant}"`);
    }
    console.log('Using fallback data:', fallback); // Debugging
    return fallback;
  }
}
