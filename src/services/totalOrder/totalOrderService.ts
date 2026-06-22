import api from '../api';
import type { TotalOrder } from '@/types/order'

export async function fetchTotalOrder(branch_id?: string): Promise<TotalOrder> {
  try {
    const url = `/total-order`;
    const query = new URLSearchParams();
    if (branch_id) query.append('branch_id', branch_id);

    const response = await api.get(`${url}?${query.toString()}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
}
