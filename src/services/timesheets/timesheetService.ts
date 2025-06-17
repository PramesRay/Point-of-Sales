import api from '../api';
import dummyTimesheetData from './dummyTimesheetData';
import type { TimesheetData } from '@/types/timesheet'

/**
 * Fetch timesheet data from backend.
 * Fallback to dummy data if request fails.
 */
export async function fetchTimesheetData(branch: string): Promise<TimesheetData[]> {
  if (branch == 'all') {
    try {
      const res = await api.get<TimesheetData[]>(`/timesheets/all`);
      return res.data;
    } catch (error) {
      console.warn(`Fetch timesheet for all branch failed, using dummy data.`, error);
      return dummyTimesheetData
    }
  }
  try {
    const response = await api.get<TimesheetData[]>(`/timesheets/${encodeURIComponent(branch)}`);
    return response.data;
  } catch (error) {
    const fallback = dummyTimesheetData.filter(tx => tx.branch.id === branch);
    if (!fallback) {
      throw new Error(`No dummy data available for branch "${branch}"`);
    }
    return fallback;
  }
}
