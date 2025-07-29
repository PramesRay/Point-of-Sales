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
  description: string
  status: 'Masuk' | 'Keluar' | 'Penyesuaian'
  branch: IdName
  time: Date
  item: InventoryItem
  meta: Meta
}

export type CreateStockMovementPayload = Omit<StockMovement, 'id' | 'meta' | 'branch' | 'item'> & {
  branch_id: string
  item: {
    id: string
    quantity: number
    category_id: string // hilangin
  }
}

export type UpdateStockMovementPayload = CreateStockMovementPayload & {
  id: string
}