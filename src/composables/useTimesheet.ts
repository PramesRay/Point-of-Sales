// src/composables/useTimesheet.ts
import { ref } from 'vue'
import { fetchTimesheetData } from '@/services/timesheets/timesheetService'
import type { TimesheetData } from '@/types/timesheet'

export function useTimesheet() {
  const data = ref<TimesheetData[]>([]);
  const loading = ref(false);


  async function load({ 
  sortBy,
  sortDesc,
  filter 
}: { 
  sortBy?: string,
  sortDesc?: boolean,
  filter?: Record<string, any> 
} = {}) {
    try {
      loading.value = true;
      data.value = await fetchTimesheetData({
        sortBy,
        sortDesc,
        filter
      });
      console.log('data timesheets', data.value);
    } catch (e: any) {
      throw e
    } finally {
      loading.value = false;
    }
  }

  return {
    data,
    loading,
    load,
  };
}