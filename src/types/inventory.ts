import type { IdName } from "./common"
import type { Branch } from "./branch";
import type { Employee } from "./employee";
import type { Meta } from "./meta";
import { omit } from "vuetify/lib/util";

export interface StockRequestSummary {
  branch: Branch;
  summary: {
    request: number
    week: number[]
    month: number[]
  }
}

export interface StockRequestList {
  id: string;
  branch: Branch;
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
  description?: string
  meta?: Meta
}

export interface InventoryItem {
  id: string
  name: string
  description: string
  unit: string
  purchase_price: number
  category: IdName
  quantity: number
  threshold: number
  expired_date: Date
  meta: Meta
}

export type CreateInventoryItemPayload = Pick<InventoryItem, 'name' | 'description' | 'purchase_price' | 'threshold'> & {
  category_id: string
}

export type UpdateInventoryItemPayload = Omit<CreateInventoryItemPayload, 'category_id'> & {
  id: string
}

export interface StockMovement { 
  id: string
  description: string
  status: 'Masuk' | 'Keluar' | 'Penyesuaian'
  branch: IdName
  time: Date
  item: InventoryItem
  meta: Meta
}

export type CreateStockMovementPayload = Omit<StockMovement, 'id' | 'meta' | 'category' | 'branch'> & {
  category_id: string 
  branch_id: string
}

export type UpdateStockMovementPayload = Omit<StockMovement, 'meta' | 'category' | 'branch'> & {
  category_id: string 
  branch_id: string
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