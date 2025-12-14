import api from '../api';
import type { CreateDirectPaymentOrderPayload, CreateOrderPayload, Order, RefundOrderItemPayload, UpdateOrderItemStatusPayload, UpdateOrderPayload, UpdateOrderPaymentPayload, UpdateOrderStatusPayload } from '@/types/order'
import { useAlertStore } from '@/stores/alert';
const alertStore = useAlertStore();

export async function fetchCurrentOrder({
    page,
    limit,
    search,
    sortBy,
    sortDesc,
    filter
  }: {
    page?: number
    limit?: number
    search?: string
    sortBy?: string
    sortDesc?: boolean
    filter?: Record<string, any>
  } = {}): Promise<{data: Order[]; total: number}> {
    try {
      const url = `/orders`;
      const query = new URLSearchParams();
      
      if (search) query.append('search', search)
      if (sortBy) query.append('sort', `${sortBy}:${sortDesc ? 'desc' : 'asc'}`)
      if (typeof page === 'number') query.append('page', page.toString())
      if (typeof limit === 'number') query.append('limit', limit.toString())
  
      if (filter) {
        for (const [key, value] of Object.entries(filter)) {
          if (value) {  // Pastikan value valid (tidak null, undefined, atau kosong)
            query.append(key, value);
          }
        }
      }
  
      const res = await api.get(`${url}?${query.toString()}`)
  
      return {
        data: res.data.data,
        total: res.data.meta?.total ?? res.data.data.length,
      }
    } catch (error) {
      console.warn(`Fetch Current Order data failed, using dummy.`, error);
      return { data: [], total: 0 }
    }
}

export async function updateOrderData(payload: UpdateOrderPayload): Promise<Order> {
  try {
    const res = await api.put(`/order/${payload.id}`, {...payload, type: 'updateOrder'});
    alertStore.showAlert('Data Order telah berubah!', 'success');
    return res.data.data;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
}

export async function updateOrderItemStatus(payload: UpdateOrderItemStatusPayload): Promise<Order> {
  try {
    const res = await api.put(`/order/${payload.id}`, {...payload, type: 'updateItems'});
    alertStore.showAlert('Data Order telah berubah!', 'success');
    return res.data.data;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
}

export async function updateOrderPayment(payload: UpdateOrderPaymentPayload): Promise<Order> {
  try {
    const res = await api.put(`/order/${payload.id}`, {...payload, type: 'updatePayment'});
    alertStore.showAlert('Data Order telah berubah!', 'success');
    return res.data.data;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
}

export async function updateOrderStatus(payload: UpdateOrderStatusPayload): Promise<Order> {
  try {
    const res = await api.put(`/order/${payload.id}`, {...payload, type: 'updateStatus'});
    alertStore.showAlert('Data Order telah berubah!', 'success');
    return res.data.data;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
}

export async function refundOrderItem(payload: RefundOrderItemPayload): Promise<Order> {
  try {
    const res = await api.put(`/order/${payload.id}/refund`, {...payload, type: 'refundItem'});
    alertStore.showAlert('Data Order telah berubah!', 'success');
    return res.data.data;
  } catch (error) {
    console.error('Error refunding order item:', error);
    throw error;
  }
}

export async function createOrderData(payload: CreateOrderPayload): Promise<Order> {
  try {
    const res = await api.post('/order', payload);
    alertStore.showAlert('Order baru telah dibuat!', 'success');
    return res.data.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

export async function processDirectPaymentOrder(payload: CreateDirectPaymentOrderPayload): Promise<Order> {
  try {
    const res = await api.post('/order/process-direct-payment', payload);
    alertStore.showAlert('Order baru telah dibuat!', 'success');
    return res.data.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}