import { ref, watchEffect } from 'vue'
import { 
  fetchCurrentOrder, 
  updateOrderData, 
  updateOrderStatus, 
  updateOrderPayment, 
  updateOrderItemStatus, 
  refundOrderItem,
  createOrderData, 
  processDirectPaymentOrder,
  setPaymentExpired
} from '@/services/totalOrder/currentOrderService'
import type { CreateDirectPaymentOrderPayload, CreateOrderPayload, Order, RefundOrderItemPayload, UpdateOrderItemStatusPayload, UpdateOrderPayload, UpdateOrderPaymentPayload, UpdateOrderStatusPayload } from '@/types/order'

export function useCurrentOrders() {
  const data      = ref<{ data: Order[]; total: number; }>({ data: [], total: 0 });
  const loading   = ref<boolean>(false);
  const error     = ref<Error | null>(null);

  async function load({
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
  } = {}) {
    loading.value = true;
    error.value   = null;
    try {
      data.value = await fetchCurrentOrder({
        page,
        limit,
        search,
        sortBy,
        sortDesc,
        filter
      })
      console.log('data', data.value)
    } catch (e: any) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  }

  async function update(payload: UpdateOrderPayload): Promise<Order> {
    loading.value = true;
    try {
      return await updateOrderData(payload);
      // await load();
    } catch (e) {
      console.error("Gagal proses order:", e);
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function updateItemStatus(payload: UpdateOrderItemStatusPayload): Promise<Order> {
    loading.value = true;
    try {
      return await updateOrderItemStatus(payload);
      // await load();
    } catch (e) {
      console.error("Gagal proses order:", e);
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function updateStatus(payload: UpdateOrderStatusPayload): Promise<Order> {
    loading.value = true;
    try {
      return await updateOrderStatus(payload);
      // await load();
    } catch (e) {
      console.error("Gagal proses order:", e);
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function updatePayment(payload: UpdateOrderPaymentPayload): Promise<Order> {
    loading.value = true;
    try {
      return await updateOrderPayment(payload);
      // await load();
    } catch (e) {
      console.error("Gagal proses order:", e);
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function refund(payload: RefundOrderItemPayload): Promise<Order> {
    loading.value = true;
    try {
      return await refundOrderItem(payload);
      // await load();
    } catch (e) {
      console.error("Gagal refund item:", e);
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function create(payload: CreateOrderPayload): Promise<Order> {
    loading.value = true;
    try {
      return await createOrderData(payload);
      // await load();
    } catch (e) {
      console.error("Gagal membuat order:", e);
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function createDirectPaymentOrder(payload: CreateDirectPaymentOrderPayload): Promise<Order> {
    loading.value = true;
    try {
      return await processDirectPaymentOrder(payload);
      // await load(branchId.value);
    } catch (error) {
      console.error('Error creating direct payment order:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  }

  async function setPaymentToExpired(id: string) {
    loading.value = true;
    try {
      return await setPaymentExpired(id);
      // await load(branchId.value);
    } catch (error) {
      console.error('Error creating direct payment order:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  }

  return {
    load,
    update,
    updateItemStatus,
    updateStatus,
    updatePayment,
    refund,
    create,
    createDirectPaymentOrder,
    setPaymentToExpired,
    data,
    loading,
    error
  };
}