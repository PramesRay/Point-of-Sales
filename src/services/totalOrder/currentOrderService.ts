import api from '../api';
import dummyOrderQue from './dummyOrderQueList';
import type { CreateOrderPayload, Order } from '@/types/order'
import { useAlertStore } from '@/stores/alert';
const alertStore = useAlertStore();

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

export async function updateOrderData(payload: {[key: string]: any }): Promise<Order> {
  try {
    const res = await api.put(`/order/${payload.id}`, { payload });
    alertStore.showAlert('Data Order telah berubah!', 'success');
    return res.data;
  } catch (error) {
    console.error('Error updating order status:', error);
    console.log('Payload:', payload);
    throw error;
  }
}

export async function createOrderData(payload: CreateOrderPayload): Promise<Order> {
  try {
    const res = await api.post('/order', { payload });
    alertStore.showAlert('Order baru telah dibuat!', 'success');
    return res.data;
  } catch (error) {
    console.error('Error creating order:', error);
    console.log('Payload:', payload);
    throw error;
  }
}

export async function processDirectPaymentOrder(payload: {order: CreateOrderPayload, payment_method: string}): Promise<Order> {
  try {
    const res = await api.post('/order/process-direct-payment', { payload });
    alertStore.showAlert('Order baru telah dibuat!', 'success');
    return res.data;
  } catch (error) {
    console.error('Error creating order:', error);
    console.log('Payload:', payload);
    throw error;
  }
}