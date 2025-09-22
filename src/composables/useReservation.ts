import { ref } from 'vue'
import { approveReservation, createReservation, deleteReservation, fetchReservationData, updateReservation } from '@/services/currentReservation/reservationService'
import type { Reservation, CreateReservationPayload, UpdateReservationPayload, ReservationApprovalPayload } from '@/types/reservation'

export function useReservation() {
  const data = ref<Reservation[]>([]);
  const dataTable = ref<{data: Reservation[], total: number}>({data: [], total: 0});
  const loading = ref(false);

async function load({ filter }: { filter?: Record<string, any> } = {}) {
  try {
    loading.value = true;
    dataTable.value = await fetchReservationData({filter});
    data.value = dataTable.value.data
  } catch (e: any) {
    throw e
  } finally {
    loading.value = false;
  }
}

async function create(payload: CreateReservationPayload) {
  try {
    loading.value = true;
    await createReservation(payload);
    // await load(branchId.value);
  } catch (e: any) {
    throw e
  } finally {
    loading.value = false;
  }
}

async function update(payload: UpdateReservationPayload) {
  try {
    loading.value = true;
    await updateReservation(payload);
    // await load(branchId.value);
  } catch (e: any) {
    throw e
  } finally {
    loading.value = false;
  }
}

async function approve(payload: ReservationApprovalPayload) {
  try {
    loading.value = true;
    await approveReservation(payload);
    // await load(branchId.value);
  } catch (e: any) {
    throw e
  } finally {
    loading.value = false;
  }
}

async function remove(id: string) {
  try {
    loading.value = true;
    await deleteReservation(id);
    // await load(branchId.value);
  } catch (e: any) {
    throw e
  } finally {
    loading.value = false;
  }
}

  return {
    data,
    dataTable,
    loading,
    load,
    create,
    update,
    approve,
    remove
  };
}