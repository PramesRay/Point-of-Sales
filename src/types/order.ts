import type { Branch } from "./branch"
import type { Customer } from "./customer"
import type { Employee } from "./employee"
import type { Meta } from "./meta"

export type TotalOrder = {
  current: number
  week: number[]
  month: number[]
}

export interface Order {
  id: string 
  branch: Branch
  employee: Employee
  table_number: string
  customer: Customer 
  is_take_away: boolean
  items: OrderItem[]
  status: 'Pending' | 'Diproses' | 'Selesai' | 'Batal' 
  amount: number
  payment_status: 'Pending' | 'Selesai' | 'Gagal'
  meta: Meta
} 

export interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
  note?: string
}