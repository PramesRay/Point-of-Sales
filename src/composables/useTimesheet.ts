// src/composables/useTimesheet.ts
import { ref, watchEffect } from 'vue'
import { fetchBranchList } from '@/services/common/branch/branchService'
import { fetchTimesheetData } from '@/services/timesheets/timesheetService'
import type { TimesheetData } from '@/types/timesheet'
import type { Branch } from '@/types/branch'

const branches = ref<Branch[]>([]);
const selectedBranch = ref<string>(''); // default kosong
const data = ref<TimesheetData | null>(null);
const loadingBranches = ref(true);
const loadingTimesheet = ref(true);

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
  loadingTimesheet.value = true;
  data.value = await fetchTimesheetData(selectedBranch.value);
  loadingTimesheet.value = false;
});

export function useTimesheet() {
  return {
    branches,
    selectedBranch,
    data,
    loadingBranches,
    loadingTimesheet,
    init,
  };
}