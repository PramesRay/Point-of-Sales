import { ref, watchEffect } from 'vue'
import { createReservation, fetchReservationData, updateReservation } from '@/services/currentReservation/reservationService'
import type { Reservation, CreateReservationPayload, UpdateReservationPayload } from '@/types/reservation'
import { useRoute } from 'vue-router'

export function useReservation() {
  const route     = useRoute();
  const branchId  = ref<string>(String(route.query.branch || 'all'));
  const data = ref<Reservation[]>([]);
  const loading = ref(true);

async function load(id: string) {
  try {
    loading.value = true;
    data.value = await fetchReservationData(id);
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
    await load(branchId.value);
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
    await load(branchId.value);
  } catch (e: any) {
    throw e
  } finally {
    loading.value = false;
  }
}

// Watch fetch timesheet when branch changes
watchEffect(() => {
  const id = String(route.query.branch || 'all');
  branchId.value = id;
  load(id);
});

  return {
    data,
    loading,
    load,
    create,
    update
  };
}