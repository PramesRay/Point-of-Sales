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
  branch: IdName
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
  quantity: number
  note: string | null
  status: 'Pending' | 'Diproses' | 'Selesai' | 'Refund'
  // name: string
  // price: number
}

export type CreateOrderPayload = Pick<Order, 'table_number'|'is_take_away'|'customer'> & {
  branch_id: string
  items: {
    id: string // id dari menu
    quantity: number
    note: string
  }[]
}

export type CreateDirectPaymentOrderPayload = CreateOrderPayload & {
  payment_method: string
}

export type UpdateOrderPayload = CreateOrderPayload & Pick<Order, 'id'>
export type UpdateOrderStatusPayload = Pick<Order, 'status' | 'id'>
export type UpdateOrderItemStatusPayload = Pick<Order, 'id'> & { items: Pick<OrderItem, 'id' | 'status'>[] }
export type UpdateOrderPaymentPayload = Pick<Order, 'id'> & {
  payment_method: string
}