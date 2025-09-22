import type { Menu } from "./menu"
import type { Customer } from "./customer"
import type { IdName } from "./common"
import type { Meta, MetaDetail } from "./meta"

export type TotalOrder = {
  current: number
  week: number[]
  month: number[]
}

export interface Order {
  id: string
  shift: {
    employee: string
    cashier: string
    kitchen: string
  }
  branch: IdName
  table_number: string | null
  customer: Customer 
  is_take_away: boolean
  items: OrderItem[]
  status: 'Pending' | 'Diproses' | 'Tersaji' | 'Selesai' | 'Batal' | 'Refund'
  amount: number
  payment_status: 'Pending' | 'Lunas' | 'Gagal' | 'Batal'
  snap_token: string
  meta: MetaDetail
}

export interface OrderItem extends Menu {
  id: string
  item_id: string
  quantity: number
  note: string | null
  status: 'Pending' | 'Diproses' | 'Tersaji' | 'Refund' | 'Batal'
}

export type CreateOrderPayload = Pick<Order, 'table_number'|'is_take_away'|'customer'> & {
  branch_id: string
  items: {
    id: string
    item_id: string
    quantity: number
    note: string
  }[]
  amount: number
}

export type CreateDirectPaymentOrderPayload = CreateOrderPayload & {
  payment_method: string
}

export type UpdateOrderPayload = CreateOrderPayload & Pick<Order, 'id'>
export type UpdateOrderStatusPayload = Pick<Order, 'status' | 'id'>
export type UpdateOrderItemStatusPayload = Pick<Order, 'id'> & { items: Pick<OrderItem, 'id' | 'status'>[] }
export type UpdateOrderPaymentPayload = Pick<Order, 'id'> & {
  amount: number
  payment_method: string
}

export type RefundOrderItemPayload = UpdateOrderItemStatusPayload & {
  amount: number
  reason: string
  method: 'Cash' | 'Digital' | 'Other'
}