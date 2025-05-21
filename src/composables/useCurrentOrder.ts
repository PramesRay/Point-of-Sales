import { ref, watchEffect } from 'vue'
import { fetchCurrentOrder, updateOrderData } from '@/services/totalOrder/currentOrderService'
import type { Order } from '@/types/order'
import { useRoute } from 'vue-router'

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


  watchEffect(() => {
    const id = String(route.query.branch || 'all');
    branchId.value = id;
    load(id);
  });

  return { load, updateOrder, data, loading, error };
}