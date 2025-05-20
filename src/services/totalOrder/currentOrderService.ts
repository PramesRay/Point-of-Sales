import api from '../api';
import dummyOrderQue from './dummyOrderQueList';
import type { Order } from '@/types/order'

/**
 * Fetch Current Order data from backend.
 * Fallback to dummy data if request fails.
 */
export async function fetchCurrentOrder(restaurant: string): Promise<Order[]> {
  try {
    console.log(`Fetching Current Order data for restaurant: ${restaurant}`); // Debugging
    const response = await api.get<Order[]>(`/current-Order/${encodeURIComponent(restaurant)}`);
    return response.data;
  } catch (error) {
    console.warn(`API error fetching Current Order for "${restaurant}", using dummy data.`, error);
    const fallback = dummyOrderQue;
    if (!fallback) {
      throw new Error(`No dummy data available for restaurant "${restaurant}"`);
    }
    console.log('Using fallback data:', fallback); // Debugging
    return fallback;
  }
}

export async function updateOrderStatus(id: string, status: string): Promise<void> {
  try {
    const res = await api.put(`/order/${id}`, { status });
    return res.data;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
}