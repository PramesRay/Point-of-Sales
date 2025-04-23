import { ref, watchEffect } from 'vue'
import { fetchBranchList } from '@/services/common/branchService'
import { fetchReservationData } from '@/services/currentReservation/reservationService'
import type { Reservation } from '@/types/reservation'
import type { Branch } from '@/types/branch'

const branches = ref<Branch[]>([]);
const selectedBranch = ref<string>(''); // default kosong
const data = ref<Reservation[] | null>(null);
const loadingBranches = ref(true);
const loadingData = ref(true);

async function init() {
  loadingBranches.value = true;
  branches.value = await fetchBranchList();
  loadingBranches.value = false;

  if (branches.value.length > 0) {
    selectedBranch.value ||= branches.value[0].id; // hanya set jika kosong
  }
}

// Watch fetch timesheet when branch changes
watchEffect(async () => {
  if (!selectedBranch.value) return;
  loadingData.value = true;
  data.value = await fetchReservationData(selectedBranch.value);
  loadingData.value = false;
});

export function useReservation() {
  return {
    branches,
    selectedBranch,
    data,
    loadingBranches,
    loadingData,
    init,
  };
}