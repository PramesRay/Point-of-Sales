import type { Branch } from "./branch";
import type { Customer } from "./customer";
import type { Employee } from "./employee";
import type { Meta } from "./meta";

export interface Orders {
  branch: Branch
  employee: Employee
  customer: Customer
  
  id: string
  table_number?: number
  is_take_away?: boolean
  total_price?: number
  payment_status?: 'Selesai' | 'Pending'
  order_status?: 'Selesai' | 'Pending' | 'Batal'
  
  meta?: Meta
}