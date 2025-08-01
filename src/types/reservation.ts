import type { IdName } from "./common";
import type { Customer } from "./customer";
import type { Meta, MetaDetail } from "./meta";

export interface Reservation {
  id: string,
  branch: IdName,
  customer: Customer,
  time: Date,
  status: 'Disetujui' | 'Pending' | 'Ditolak',
  people: number
  notes: string
  meta: MetaDetail
}

export type CreateReservationPayload = Omit<Reservation, 'id' | 'branch' | 'status' | 'meta'> & {
  branch_id: string
}

export type CreateReservationByOwnerPayload = CreateReservationPayload & {
  status: 'Disetujui'
}

export type UpdateReservationPayload = Omit<Reservation, 'branch' | 'meta'> & {
  branch_id: string
}

export type ReservationApprovalPayload = Pick<Reservation, 'id' | 'status'>
