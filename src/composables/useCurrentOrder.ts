import { ref, watchEffect } from 'vue'
import { fetchCurrentOrder, updateOrderData, createOrderData, processDirectPaymentOrder } from '@/services/totalOrder/currentOrderService'
import type { CreateOrderPayload, Order } from '@/types/order'
import { useRoute } from 'vue-router'
import { create } from 'lodash';

export function useCurrentOrders() {
  const route     = useRoute();
  const branchId  = ref<string>(String(route.query.branch || 'all'));
  const data      = ref<Order[]>([]);
  const loading   = ref<boolean>(false);
  const error     = ref<Error | null>(null);

  async function load(id: string) {
    loading.value = true;
    error.value   = null;
    try {
      data.value = await fetchCurrentOrder(id);
    } catch (e: any) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  }

  async function updateOrder(payload: {[key: string]: any }) {
    try {
      loading.value = true;
      await updateOrderData(payload);
      await load(branchId.value);
    } catch (e) {
      console.error("Gagal proses order:", e);
    } finally {
      loading.value = false;
    }
  }

  async function createOrder(payload: CreateOrderPayload) {
    try {
      loading.value = true;
      await createOrderData(payload);
      await load(branchId.value);
    } catch (e) {
      console.error("Gagal membuat order:", e);
    } finally {
      loading.value = false;
    }
  } 

  async function processDirectPayment(payload: {order: CreateOrderPayload, payment_method: string}) {
    try {
      loading.value = true;
      await processDirectPaymentOrder(payload);
      await load(branchId.value);
    } catch (error) {
      console.error('Error creating direct payment order:', error);
      console.log('Payload:', payload);
      throw error;
    } finally {
      loading.value = false;
    }
  }


  watchEffect(() => {
    const id = String(route.query.branch || 'all');
    branchId.value = id;
    load(id);
  });

  return { load, updateOrder, createOrder, processDirectPayment, data, loading, error };
}