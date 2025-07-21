import { ref } from 'vue'
import { useAlertStore } from '@/stores/alert'
import { useUserStore } from '@/stores/authUser'
import { 
  fetchShiftCashier, startShiftCashier, updateShiftCashier, endShiftCashier,
  fetchShiftKitchen, startShiftKitchen, updateShiftKitchen, endShiftKitchen,
  startShiftEmployee,
  endShiftEmployee,
  fetchShiftEmployee
} from '@/services/shift/shiftService'
import {
  type StartShiftCashierPayload,
  type UpdateShiftCashierPayload,
  type StartShiftKitchenPayload,
  type UpdateShiftKitchenPayload,
  type ShiftCashier,
  type ShiftKitchen,
  type Shift
} from '@/types/shift'

const alert = useAlertStore()
const userStore = useUserStore()

export function useShift() {
  const loading = ref(false)
  const shiftBranch = ref<{ data: (ShiftCashier | ShiftKitchen)[]; total: number; }>({ data: [], total: 0 });
  const shiftEmployee = ref<Shift[] | null>(null)

  async function loadShiftbyRole(branch_id?: string) {
    try {
      loading.value = true
      if (userStore.hasRole('Kasir')) {
        shiftBranch.value = await fetchShiftCashier(branch_id)
      } else if (userStore.hasRole('Dapur')) {
        shiftBranch.value = await fetchShiftKitchen(branch_id)
      } else if (userStore.hasRole(['Admin', 'Pemilik'])) {
        const kitchenShift = await fetchShiftKitchen(branch_id)
        const cashierShift = await fetchShiftCashier(branch_id)
        shiftBranch.value = { data: [...kitchenShift.data, ...cashierShift.data], total: kitchenShift.total + cashierShift.total }
      }
    } catch (err) {
      throw err
    } finally {
      loading.value = false
    }
  }

  async function loadEmployee({
    page,
    itemsPerPage,
    search,
    sortBy,
    sortDesc,
    branchId,
  }: {
    page?: number
    itemsPerPage?: number
    search?: string
    sortBy?: string
    sortDesc?: boolean
    branchId?: string
  } = {}) {
    try {
      loading.value = true
      const { data, total } = await fetchShiftEmployee(
        branchId,
        page,
        itemsPerPage,
        search,
        sortBy,
        sortDesc
      )
      shiftEmployee.value = data
      return { data, total }
    } catch (err) {
      throw err
    } finally {
      loading.value = false
    }
  }

  async function startEmployee(branch_id: string) {
    try {
      loading.value = true
      const res = await startShiftEmployee(branch_id)
      alert.showAlert('Shift pegawai dimulai.', 'success')
      return res
    } catch (err) {
      alert.showAlert('Gagal memulai shift pegawai.', 'error')
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function endEmployee(branch_id: string) {
    try {
      loading.value = true

      const shiftEmployee = await fetchShiftEmployee(branch_id)

      if (userStore.hasRole('Admin')) {
        const res = await endShiftEmployee(branch_id)
        alert.showAlert('Shift pegawai berakhir.', 'success')
        return res
      }

      if (shiftBranch.value.data.length > 0 && shiftEmployee.data.length == 1) {
        return alert.showAlert('Restoran perlu ditutup terlebih dahulu.', 'warning')
      }
      const res = await endShiftEmployee(branch_id)
      alert.showAlert('Shift pegawai berakhir.', 'success')
      return res
    } catch (err) {
      alert.showAlert('Gagal mengakhiri shift pegawai.', 'error')
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function loadCashier({
    page,
    itemsPerPage,
    search,
    sortBy,
    sortDesc,
    branchId,
  }: {
    page?: number
    itemsPerPage?: number
    search?: string
    sortBy?: string
    sortDesc?: boolean
    branchId?: string
  } = {}) {
    try {
      loading.value = true
      const { data, total } = await fetchShiftCashier(
        branchId,
        page,
        itemsPerPage,
        search,
        sortBy,
        sortDesc
      )
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

  async function endCashier(id: string) {
    try {
      loading.value = true
      const res = await endShiftCashier(id)
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
    itemsPerPage,
    search,
    sortBy,
    sortDesc,
    branchId,
  }: {
    page?: number
    itemsPerPage?: number
    search?: string
    sortBy?: string
    sortDesc?: boolean
    branchId?: string
  } = {}) {
    try {
      loading.value = true
      const { data, total } = await fetchShiftKitchen(
        branchId,
        page,
        itemsPerPage,
        search,
        sortBy,
        sortDesc
      )
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
    shiftBranch,
    loadShiftbyRole,
    shiftEmployee,
    loadEmployee,
    startEmployee,
    endEmployee,
    loadCashier,
    startCashier,
    updateCashier,
    endCashier,
    loadKitchen,
    startKitchen,
    updateKitchen,
    endKitchen
  }
}