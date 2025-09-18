import { ref } from 'vue'
import { fetchTotalOrder } from '@/services/totalOrder/totalOrderService'
import type { TotalOrder } from '@/types/order'

export const useTotalOrder = () => {
  const data = ref<TotalOrder>()
  const loading = ref<boolean>(false)

  async function load(id?: string) {
    try {
      loading.value = true
      data.value = await fetchTotalOrder(id)
    } catch (e: any) {
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    data,
    loading,
    load
  }
}