import { ref, watchEffect } from 'vue'
import { 
  fetchCurrentOrder, 
  updateOrderData, 
  updateOrderStatus, 
  updateOrderPayment, 
  updateOrderItemStatus, 
  refundOrderItem,
  createOrderData, 
  processDirectPaymentOrder 
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

  async function update(payload: UpdateOrderPayload) {
    loading.value = true;
    try {
      await updateOrderData(payload);
      // await load();
    } catch (e) {
      console.error("Gagal proses order:", e);
    } finally {
      loading.value = false;
    }
  }

  async function updateItemStatus(payload: UpdateOrderItemStatusPayload) {
    loading.value = true;
    try {
      await updateOrderItemStatus(payload);
      // await load();
    } catch (e) {
      console.error("Gagal proses order:", e);
    } finally {
      loading.value = false;
    }
  }

  async function updateStatus(payload: UpdateOrderStatusPayload) {
    loading.value = true;
    try {
      await updateOrderStatus(payload);
      // await load();
    } catch (e) {
      console.error("Gagal proses order:", e);
    } finally {
      loading.value = false;
    }
  }

  async function updatePayment(payload: UpdateOrderPaymentPayload) {
    loading.value = true;
    try {
      await updateOrderPayment(payload);
      // await load();
    } catch (e) {
      console.error("Gagal proses order:", e);
    } finally {
      loading.value = false;
    }
  }

  async function refund(payload: RefundOrderItemPayload) {
    loading.value = true;
    try {
      await refundOrderItem(payload);
      // await load();
    } catch (e) {
      console.error("Gagal refund item:", e);
    } finally {
      loading.value = false;
    }
  }

  async function create(payload: CreateOrderPayload) {
    loading.value = true;
    try {
      await createOrderData(payload);
      // await load();
    } catch (e) {
      console.error("Gagal membuat order:", e);
    } finally {
      loading.value = false;
    }
  }

  async function createDirectPaymentOrder(payload: CreateDirectPaymentOrderPayload) {
    loading.value = true;
    try {
      await processDirectPaymentOrder(payload);
      // await load(branchId.value);
    } catch (error) {
      console.error('Error creating direct payment order:', error);
      console.log('Payload:', payload);
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
    data,
    loading,
    error
  };
}