import api from '../api';
import type { Reservation, CreateReservationPayload, UpdateReservationPayload, ReservationApprovalPayload } from '@/types/reservation'
import { useAlertStore } from '@/stores/alert';

const alertStore = useAlertStore();

/**
 * Fetch timesheet data from backend.
 * Fallback to dummy data if request fails.
 */
export async function fetchReservationData({
  page,
  limit,
  search,
  sortBy,
  sortDesc,
  filter
}: {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortDesc?: boolean
  filter?: Record<string, any>
} = {}): Promise<{data: Reservation[], total: number}> {
  try {
    const url = `/reservations`;
    const query = new URLSearchParams();
    
    if (search) query.append('search', search)
    if (sortBy) query.append('sort', `${sortBy}:${sortDesc ? 'desc' : 'asc'}`)
    if (typeof page === 'number') query.append('page', page.toString())
    if (typeof limit === 'number') query.append('limit', limit.toString())

    if (filter) {
      for (const [key, value] of Object.entries(filter)) {
        if (value) {  // Pastikan value valid (tidak null, undefined, atau kosong)
          query.append(key, value);
        }
      }
    }

    const response = await api.get(`${url}?${query}`);

    return {
      data: response.data.data,
      total: response.data.meta?.total ?? response.data.data.length
    }
  } catch (error) {
    console.warn(`Fetch reservation failed, using dummy data.`, error);
    return { data: [], total: 0 };
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
    const response = await api.put<Reservation>('/reservation', {...payload, type : 'updateReservation'});
    alertStore.showAlert('Reservasi berhasil diubah!', 'success');
    return response.data;
  } catch (error) {
    console.warn('API error creating reservation, using dummy data.', error);
    alertStore.showAlert('Reservasi gagal diubah!', 'error');
    throw error;
  }
}

export async function approveReservation(payload: ReservationApprovalPayload): Promise<Reservation> {
  try {
    const response = await api.put<Reservation>('/reservation', {...payload, type : 'updateReservationStatus' });
    alertStore.showAlert('Reservasi berhasil diubah!', 'success');
    return response.data;
  } catch (error) {
    console.warn('API error creating reservation, using dummy data.', error);
    alertStore.showAlert('Reservasi gagal diubah!', 'error');
    throw error;
  }
}

export async function deleteReservation(id: string): Promise<void> {
  try {
    await api.delete(`/reservation/${id}`);
    alertStore.showAlert('Reservasi berhasil dihapus!', 'success');
  } catch (error) {
    console.warn('API error deleting reservation, using dummy data.', error);
    alertStore.showAlert('Reservasi gagal dihapus!', 'error');
    throw error;
  }
}