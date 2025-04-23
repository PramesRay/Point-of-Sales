import { ref, watchEffect } from 'vue'
import { fetchBranchList } from '@/services/common/branchService'
import { fetchEmployeeActive } from '@/services/employeeActive/employeeActiveService'
import type { EmployeeActive } from '@/types/employeeActive'
import type { Branch } from '@/types/branch'

const branches = ref<Branch[]>([]);
const selectedBranch = ref<string>(''); // default kosong
const data = ref<EmployeeActive | null>(null);
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
  data.value = await fetchEmployeeActive(selectedBranch.value);
  loadingData.value = false;
});

export function useEmployeeActive() {
  return {
    branches,
    selectedBranch,
    data,
    loadingBranches,
    loadingData,
    init,
  };
}