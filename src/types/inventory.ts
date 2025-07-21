import type { IdName } from "./common"
import type { Branch } from "./branch";
import type { Employee } from "./employee";
import type { Meta } from "./meta";
import { omit } from "vuetify/lib/util";

export interface StockRequestSummary {
  branch: IdName;
  summary: {
    request: number
    week: number[]
    month: number[]
  }
}

export interface StockRequestList {
  id: string;
  branch: IdName;
  employee: Employee;
  items: {
    item: InventoryItem
    status: 'Disetujui' | 'Ditolak' | 'Pending';
  }[]
  status: 'Disetujui'| 'Beberapa Disetujui' | 'Ditolak' | 'Pending';
  note: string;
  time: Meta
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
    category_id: string
  }
}

export type UpdateStockMovementPayload = CreateStockMovementPayload & {
  id: string
}


export interface CreateStockRequestPayload {
  branch_id: string
  note: string
  items: {[K in keyof Pick<InventoryItem, 'id' | 'name' | 'unit' | 'quantity'>]: InventoryItem[K] | null}[]
}


export interface ApproveStockRequestPayload {
  id: string
  items: { 
    id: string, 
    status: 'Disetujui' | 'Ditolak' 
  }[]
  note: string
}