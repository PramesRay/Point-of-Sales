import { ref } from 'vue'
import { useAlertStore } from '@/stores/alert'
import { useUserStore } from '@/stores/authUser'
import { 
  fetchShiftCashier, startShiftCashier, updateShiftCashier, endShiftCashier,
  fetchShiftKitchen, startShiftKitchen, updateShiftKitchen, endShiftKitchen,
  startShiftEmployee,
  endShiftEmployee,
  fetchShiftEmployee,
  fetchShiftWarehouse,
  startShiftWarehouse,
  endShiftWarehouse,
  updateShiftWarehouse
} from '@/services/shift/shiftService'
import {
  type StartShiftCashierPayload,
  type UpdateShiftCashierPayload,
  type StartShiftKitchenPayload,
  type UpdateShiftKitchenPayload,
  type ShiftCashier,
  type ShiftKitchen,
  type Shift,
  type ShiftWarehouse,
  type UpdateShiftWarehousePayload,
  type EndShiftCashierPayload
} from '@/types/shift'

const alert = useAlertStore()
const userStore = useUserStore()

export function useShift() {
  const loading = ref(false)
  const shiftCashier = ref<{ data: ShiftCashier[]; total: number; }>({ data: [], total: 0 });
  const shiftKitchen = ref<{ data: ShiftKitchen[]; total: number; }>({ data: [], total: 0 });
  const shiftWarehouse = ref<{ data: ShiftWarehouse[]; total: number; }>({ data: [], total: 0 });
  const shiftEmployee = ref<{ data: Shift[]; total: number; }>({ data: [], total: 0 });

  async function loadShiftbyRole({
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
    try {
      loading.value = true
      const branchId = userStore.me?.activity?.branch?.id;
      if (userStore.hasRole('kasir')) {
        const { data, total } = await fetchShiftCashier({
          page,
          limit,
          search,
          sortBy,
          sortDesc,
          filter:{
            'branch_id': branchId
          }
        });
        shiftCashier.value = { data, total };
      } else if (userStore.hasRole('dapur')) {
        const { data, total } = await fetchShiftKitchen({
          page,
          limit,
          search,
          sortBy,
          sortDesc,
          filter:{
            'branch_id': branchId
          }
        });
        shiftKitchen.value = { data, total };
      } else if (userStore.hasRole('gudang')) {
        const { data, total } = await fetchShiftWarehouse({
          page,
          limit,
          search,
          sortBy,
          sortDesc,
          filter
        });
        shiftWarehouse.value = { data, total };
      } else if (userStore.hasRole(['admin', 'pemilik'])) {
        const cashier = await fetchShiftCashier({
          page,
          limit,
          search,
          sortBy,
          sortDesc,
          filter:{
            'branch_id': branchId
          }
        });
        const kitchen = await fetchShiftKitchen({
          page,
          limit,
          search,
          sortBy,
          sortDesc,
          filter:{
            'branch_id': branchId
          }
        });
        const warehouse = await fetchShiftWarehouse({
          page,
          limit,
          search,
          sortBy,
          sortDesc,
          filter
        });
        shiftCashier.value = { data: cashier.data, total: cashier.total };
        shiftKitchen.value = { data: kitchen.data, total: kitchen.total };
        shiftWarehouse.value = { data: warehouse.data, total: warehouse.total };
      }
    } catch (err) {
      throw err
    } finally {
      loading.value = false
    }
  }

  async function loadEmployee({
    branchId,
    page,
    limit,
    search,
    sortBy,
    sortDesc,
    filter
  }: {
    branchId?: string
    page?: number
    limit?: number
    search?: string
    sortBy?: string
    sortDesc?: boolean
    filter?: Record<string, any>
  } = {}) {
    try {
      loading.value = true
      const { data, total } = await fetchShiftEmployee({
        branchId,
        page,
        limit,
        search,
        sortBy,
        sortDesc,
        filter
      })
      shiftEmployee.value = { data, total }
      return { data, total }
    } catch (err) {
      throw err
    } finally {
      loading.value = false
    }
  }

  async function startEmployee() {
    try {
      loading.value = true
      const res = await startShiftEmployee()
      alert.showAlert('Shift pegawai dimulai.', 'success')
      return res
    } catch (err) {
      alert.showAlert('Gagal memulai shift pegawai.', 'error')
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function endEmployee() {
    try {
      loading.value = true

      // const shiftEmployee = await fetchShiftEmployee({
      //   filter: { 
      //     branch_id: userStore.me?.activity?.branch?.id,
      //     end: null
      //   },
      //   sortBy: 'created_at',
      //   sortDesc: true
      // })

      // if (userStore.hasRole('Admin')) {
      //   const res = await endShiftEmployee(id)
      //   alert.showAlert('Shift pegawai berakhir.', 'success')
      //   return res
      // }

      // if ((shiftKitchen.value.data.length > 0 || shiftCashier.value.data.length > 0) && shiftEmployee.data.length === 1) {
      //   return alert.showAlert('Restoran perlu ditutup terlebih dahulu.', 'warning')
      // }
      // const res = await endShiftEmployee(id)
      // alert.showAlert('Shift pegawai berakhir.', 'success')
      const res = await endShiftEmployee()
      alert.showAlert('Shift pegawai berhasil diakhiri.', 'success')
      return res
    } catch (err) {
      alert.showAlert('Gagal mengakhiri shift pegawai.', 'error')
      throw err
    } finally {
      loading.value = false
    }
  }

  async function loadWarehouse({
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
    try {
      loading.value = true
      const { data, total } = await fetchShiftWarehouse({
        page,
        limit,
        search,
        sortBy,
        sortDesc,
        filter
      })
      shiftWarehouse.value = { data, total }
      return { data, total }
    } catch (err) {
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function startWarehouse() {
    try {
      loading.value = true
      const res = await startShiftWarehouse()
      alert.showAlert('Shift gudang dimulai.', 'success')
      return res
    } catch (err) {
      alert.showAlert('Gagal memulai shift gudang.', 'error')
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateWarehouse(payload: UpdateShiftWarehousePayload) {
    try {
      loading.value = true
      const res = await updateShiftWarehouse(payload)
      alert.showAlert('Shift gudang dimulai.', 'success')
      return res
    } catch (err) {
      alert.showAlert('Gagal memulai shift gudang.', 'error')
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function endWarehouse(id: string) {
    try {
      loading.value = true

      // const shiftWarehouse = await fetchShiftWarehouse()

      // if (userStore.hasRole('Admin')) {
      //   const res = await endShiftWarehouse(id)
      //   alert.showAlert('Shift pegawai berakhir.', 'success')
      //   return res
      // }

      // if ((shiftEmployee.value?.total === 1) && shiftWarehouse.data.length > 0) {
      //   return alert.showAlert('Shift gudang perlu ditutup terlebih dahulu.', 'warning')
      // }
      // const res = await endShiftWarehouse(id)
      // alert.showAlert('Shift gudang berakhir.', 'success')
      const res = await endShiftWarehouse(id)
      alert.showAlert('Shift gudang berhasil diakhiri.', 'success')
      return res
    } catch (err) {
      alert.showAlert('Gagal mengakhiri shift gudang.', 'error')
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function loadCashier({
    page,
    limit,
    search,
    sortBy,
    sortDesc,
    filter,
  }: {
    page?: number
    limit?: number
    search?: string
    sortBy?: string
    sortDesc?: boolean
    filter?: Record<string, any>
  } = {}) {
    try {
      loading.value = true
      const { data, total } = await fetchShiftCashier({
        page,
        limit,
        search,
        sortBy,
        sortDesc,
        filter
      })
      shiftCashier.value = { data, total }
      return { data, total }
    } catch (err) {
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function startCashier(payload: StartShiftCashierPayload) {
    try {
      loading.value = true
      const res = await startShiftCashier(payload)
      alert.showAlert('Shift kasir dimulai.', 'success')
      return res
    } catch (err) {
      alert.showAlert('Gagal memulai shift kasir.', 'error')
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateCashier(payload: UpdateShiftCashierPayload) {
    try {
      loading.value = true
      const res = await updateShiftCashier(payload)
      alert.showAlert('Shift kasir berhasil diperbaharui.', 'success')
      return res
    } catch (err) {
      alert.showAlert('Gagal mengubah data shift kasir', 'error')
      throw err
    } finally {
      loading.value = false
    }
  }

  async function endCashier(payload: EndShiftCashierPayload) {
    try {
      loading.value = true
      const res = await endShiftCashier(payload)
      alert.showAlert('Shift kasir berhasil diakhiri.', 'success')
      return res
    } catch (err) {
      alert.showAlert('Gagal mengakhiri shift kasir.', 'error')
      throw err
    } finally {
      loading.value = false
    }
  }

  async function loadKitchen({
    page,
    limit,
    search,
    sortBy,
    sortDesc,
    filter,
  }: {
    page?: number
    limit?: number
    search?: string
    sortBy?: string
    sortDesc?: boolean
    filter?: Record<string, any>
  } = {}) {
    try {
      loading.value = true
      const { data, total } = await fetchShiftKitchen({
        page,
        limit,
        search,
        sortBy,
        sortDesc,
        filter
      })
      shiftKitchen.value = { data, total }
      console.log('hasil fetch shift kitchen', { data, total })
      return { data, total }
    } catch (err) {
      throw err
    } finally {
      loading.value = false
    }
  }

  async function startKitchen(payload: StartShiftKitchenPayload) {
    try {
      loading.value = true
      const res = await startShiftKitchen(payload)
      alert.showAlert('Shift dapur dimulai.', 'success')
      return res
    } catch (err) {
      alert.showAlert('Gagal memulai shift dapur.', 'error')
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateKitchen(payload: UpdateShiftKitchenPayload) {
    try {
      loading.value = true
      const res = await updateShiftKitchen(payload)
      alert.showAlert('Shift dapur berhasil diperbaharui.', 'success')
      return res
    } catch (err) {
      alert.showAlert('Gagal mengubah data shift dapur.', 'error')
      throw err
    } finally {
      loading.value = false
    }
  }

  async function endKitchen(id: string) {
    try {
      loading.value = true
      const res = await endShiftKitchen(id)
      alert.showAlert('Shift dapur berhasil diakhiri.', 'success')
      return res
    } catch (err) {
      alert.showAlert('Gagal mengakhiri shift dapur.', 'error')
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    
    loadShiftbyRole,

    shiftWarehouse,
    loadWarehouse,
    startWarehouse,
    updateWarehouse,
    endWarehouse,

    shiftEmployee,
    loadEmployee,
    startEmployee,
    endEmployee,

    shiftCashier,
    loadCashier,
    startCashier,
    updateCashier,
    endCashier,

    shiftKitchen,
    loadKitchen,
    startKitchen,
    updateKitchen,
    endKitchen
  }
}