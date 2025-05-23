import type { Branch } from "./branch"
import type { Customer } from "./customer"
import type { IdName } from "./common"
import type { Meta } from "./meta"

export type TotalOrder = {
  current: number
  week: number[]
  month: number[]
}

export interface Order {
  id: string 
  branch: Branch
  employee: IdName
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

// payload
export interface CreateOrderPayload {
  branch_id: string
  employee_id: string
  table_number: string
  customer: {
    name: string
    phone?: string
  }
  is_take_away: boolean | null
  items: {
    id: string       // id dari menu
    quantity: number
    note: string
  }[]
}

export interface UpdateOrderPayload {
  id: string
  branch_id: string
  employee_id: string
  table_number: string
  customer: {
    name: string
    phone?: string
  }
  is_take_away: boolean
  items: {
    id: string       // id dari menu
    quantity: number
    note?: string
  }[]
}