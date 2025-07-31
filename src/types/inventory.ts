import type { IdName } from "./common"
import type { Branch } from "./branch";
import type { Employee } from "./employee";
import type { Meta, MetaDetail } from "./meta";

export interface StockRequestSummary {
  branch: IdName;
  summary: {
    request: number
    week: number[]
    month: number[]
  }
}

export interface StockRequest {
  id: string;
  branch: IdName;
  shift: {
    kitchen: string;
    warehouse: string | null;
  }
  items: {
    item: Pick<InventoryItem, 'id' | 'name' | 'unit'>
    status: 'Disetujui' | 'Ditolak' | 'Pending';
    quantity: number
  }[]
  status: 'Disetujui'| 'Beberapa Disetujui' | 'Ditolak' | 'Pending';
  note: string;
  meta: MetaDetail
}

export type CreateStockRequestPayload = Pick<StockRequest, 'note'> & {
  items: {
    id: string
    quantity: number
  }[]
}

export type UpdateStockRequestPayload = CreateStockRequestPayload & {
  id: string
}

export interface ApproveStockRequestPayload {
  id: string
  items: { 
    id: string, 
    approved: boolean
  }[]
  note: string
}

export interface Category {
  id: string
  name: string
  description: string
  meta?: Meta
}

export type CreateCategoryPayload = Omit<Category, 'id' | 'meta'>
export type UpdateCategoryPayload = Omit<Category, 'meta'>

export interface InventoryItem {
  id: string
  name: string
  description: string
  unit: string
  purchase_price: number
  category: IdName
  threshold: number
  quantity: number
  expired_date: Date | null
  is_new: boolean
  meta: Meta
}

export type UpdateInventoryItemPayload = Omit<InventoryItem, 'category' | 'quantity' | 'is_new' | 'meta'> & {
  category_id: string
}
export type CreateInventoryItemPayload = Omit<UpdateInventoryItemPayload, 'id' | 'quantity' | 'is_new' | 'expired_date'>


export interface StockMovement { 
  id: string
  shift_warehouse: string;
  item: InventoryItem
  description: string
  status: 'Masuk' | 'Keluar' | 'Pengurangan'
  branch: IdName | null
  time: Date
  meta: MetaDetail
}

export type CreateStockMovementPayload = Pick<StockMovement, 'shift_warehouse' | 'description' | 'status' | 'time'> & {
  branch_id: string | null
  item: {
    id: string
    quantity: number
  }
}

export type UpdateStockMovementPayload = CreateStockMovementPayload & {
  id: string
}