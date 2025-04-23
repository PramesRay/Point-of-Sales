import api from '../api';
import dummyTimesheetData from './dummyTimesheetData';
import type { TimesheetData } from '@/types/timesheet'

/**
 * Fetch timesheet data from backend.
 * Fallback to dummy data if request fails.
 */
export async function fetchTimesheetData(restaurant: string): Promise<TimesheetData> {
  try {
    const response = await api.get<TimesheetData>(`/timesheets/${encodeURIComponent(restaurant)}`);
    return response.data;
  } catch (error) {
    const fallback = dummyTimesheetData[restaurant];
    if (!fallback) {
      throw new Error(`No dummy data available for restaurant "${restaurant}"`);
    }
    return fallback;
  }
}
