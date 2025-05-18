import type { Branch } from "./branch"
import type { Customer } from "./customer"
import type { Employee } from "./employee"
import type { Item } from "./inventoryItem"
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
  status: 'Pending' | 'Diproses' | 'Siap Saji' | 'Selesai' | 'Batal' 
  amount: number
  payment_status: 'Pending' | 'Selesai' | 'Batal'
  meta: Meta
} 

export interface OrderItem {
  id: string
  menu: Item 
  name: string
  quantity: number
  note?: string
  meta?: Meta 
}