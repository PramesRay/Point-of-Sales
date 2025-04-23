import type { Customer } from "./customer";

export interface Reservation {
  customer: Customer,
  date: Date,
  time: string,
  status: 'Disetujui' | 'Pending' | 'Ditolak',
  people: number
}