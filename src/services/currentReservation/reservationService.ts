import api from '../api';
import dummyReservation from './dummyReservation';
import type { Reservation } from '@/types/reservation'

/**
 * Fetch timesheet data from backend.
 * Fallback to dummy data if request fails.
 */
export async function fetchReservationData(restaurant: string): Promise<Reservation[]> {
  try {
    const response = await api.get<Reservation[]>(`/reservation/${encodeURIComponent(restaurant)}`);
    return response.data;
  } catch (error) {
    const fallback = dummyReservation[restaurant];
    if (!fallback) {
      throw new Error(`No dummy data available for restaurant "${restaurant}"`);
    }
    return fallback;
  }
}
