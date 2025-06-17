// src/composables/useTimesheet.ts
import { ref, watchEffect } from 'vue'
import { fetchTimesheetData } from '@/services/timesheets/timesheetService'
import type { TimesheetData } from '@/types/timesheet'
import { useRoute } from 'vue-router'


export function useTimesheet() {
  const route = useRoute();
  const branchId = ref<string>(String(route.query.branch || 'all'));
  const data = ref<TimesheetData[]>([]);
  const loading = ref(true);

  async function load(id: string) {
    try {
      loading.value = true;
      data.value = await fetchTimesheetData(id);
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
  };
}