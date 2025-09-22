import api from '../api';
import dummyTotalOrder from './dummyTotalOrder';
import type { TotalOrder } from '@/types/order'

export async function fetchTotalOrder(branch_id?: string): Promise<TotalOrder> {
  try {
    const url = `/total-order`;
    const query = new URLSearchParams();
    if (branch_id) query.append('branch_id', branch_id);

    const response = await api.get(`${url}?${query.toString()}`);
    return response.data.data;
  } catch (error) {
    console.warn(`API error fetching total order for "${branch_id}", using dummy data.`, error);
    const fallback = dummyTotalOrder[branch_id || 0];
    if (!fallback) {
      throw new Error(`No dummy data available for restaurant "${branch_id}"`);
    }
    console.log('Using fallback data:', fallback); // Debugging
    return fallback;
  }
}
