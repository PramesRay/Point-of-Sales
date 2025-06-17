import type { IdName } from "./common";
import type { Customer } from "./customer";
import type { Meta } from "./meta";

export interface Reservation {
  id: string,
  branch: IdName,
  customer: Customer,
  time: Date,
  status: 'Disetujui' | 'Pending' | 'Ditolak',
  people: number
  notes: string
  meta: Meta
}

export type CreateReservationPayload = Omit<Reservation, 'id' | 'branch' | 'status' | 'meta'> & {
  branch_id: string
}

export type UpdateReservationPayload = Omit<Reservation, 'branch' | 'meta'> & {
  branch_id: string
}