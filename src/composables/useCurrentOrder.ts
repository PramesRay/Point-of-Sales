import { ref, watchEffect } from 'vue'
import { fetchCurrentOrder, updateOrderData, createOrderData, processDirectPaymentOrder } from '@/services/totalOrder/currentOrderService'
import type { CreateDirectPaymentOrderPayload, CreateOrderPayload, Order, UpdateOrderItemStatusPayload, UpdateOrderPayload, UpdateOrderPaymentPayload, UpdateOrderStatusPayload } from '@/types/order'

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

  async function update(payload: UpdateOrderPaymentPayload | UpdateOrderStatusPayload | UpdateOrderItemStatusPayload | UpdateOrderPayload) {
    loading.value = true;
    try {
      await updateOrderData(payload);
      await load();
    } catch (e) {
      console.error("Gagal proses order:", e);
    } finally {
      loading.value = false;
    }
  }

  async function create(payload: CreateOrderPayload) {
    loading.value = true;
    try {
      await createOrderData(payload);
      await load();
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
    create,
    createDirectPaymentOrder,
    data,
    loading,
    error
  };
}