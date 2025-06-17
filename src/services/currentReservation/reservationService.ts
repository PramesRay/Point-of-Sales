import api from '../api';
import dummyReservation from './dummyReservation';
import type { Reservation, CreateReservationPayload, UpdateReservationPayload } from '@/types/reservation'
import { useAlertStore } from '@/stores/alert';

const alertStore = useAlertStore();

/**
 * Fetch timesheet data from backend.
 * Fallback to dummy data if request fails.
 */
export async function fetchReservationData(branch: string): Promise<Reservation[]> {
  if (branch == 'all') {
    try {
      const res = await api.get<Reservation[]>(`/reservation/all`);
      return res.data;
    } catch (error) {
      console.warn(`Fetch reservation for all branch failed, using dummy data.`, error);
      return dummyReservation
    }
  }

  try {
    const response = await api.get<Reservation[]>(`/reservation/${encodeURIComponent(branch)}`);
    return response.data;
  } catch (error) {
    const fallback = dummyReservation.filter(tx => tx.branch.id === branch);
    if (!fallback) {
      throw new Error(`No dummy data available for restaurant "${branch}"`);
    }
    console.log('Using fallback data:', fallback);
    return fallback;
  }
}

export async function createReservation(payload: CreateReservationPayload): Promise<Reservation> {
  try {
    const response = await api.post<Reservation>('/reservation', payload);
    alertStore.showAlert('Reservasi berhasil dibuat!', 'success');
    return response.data;
  } catch (error) {
    console.warn('API error creating reservation, using dummy data.', error);
    alertStore.showAlert('Reservasi gagal dibuat!', 'error');
    throw error;
  }
}

export async function updateReservation(payload: UpdateReservationPayload): Promise<Reservation> {
  try {
    const response = await api.put<Reservation>('/reservation', payload);
    alertStore.showAlert('Reservasi berhasil diubah!', 'info');
    return response.data;
  } catch (error) {
    console.warn('API error creating reservation, using dummy data.', error);
    alertStore.showAlert('Reservasi gagal diubah!', 'error');
    throw error;
  }
}