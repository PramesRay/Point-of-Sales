import { ref, watchEffect } from 'vue'
import { fetchBranchList } from '@/services/common/branchService'
import { fetchTotalOrder } from '@/services/totalOrder/totalOrderService'
import type { Branch } from '@/types/branch'
import type { TotalOrder } from '@/types/totalOrder'

const branches = ref<Branch[]>([]);
const selectedBranch = ref<string>(''); // default kosong
const data = ref<TotalOrder | null>(null);
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

// Watch fetch Employee Active Data when branch changes
watchEffect(async () => {
  if (!selectedBranch.value) return;
  loadingData.value = true;
  data.value = await fetchTotalOrder(selectedBranch.value);
  loadingData.value = false;
});

export function useTotalOrder() {
  return {
    branches,
    selectedBranch,
    data,
    loadingBranches,
    loadingData,
    init,
  };
}