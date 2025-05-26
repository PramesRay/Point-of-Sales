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
  description?: string
  unit?: string
  category?: Category
  quantity?: number
  threshold?: number
  expired_date?: Date
  meta?: Meta
}

export interface StockMovement { 
  id: string
  name: string
  description?: string
  category?: Category
  branch?: Branch
  employee?: IdName
  quantity?: number
  unit?: string 
  status?: 'Masuk' | 'Keluar' 
  time?: Date
  meta?: Meta
}

export type CreateStockMovementPayload = Omit<StockMovement, 'id' | 'meta' | 'category' | 'branch'> & {
  category_id: string 
  branch_id: string
}

export type UpdateStockMovementPayload = Omit<StockMovement, 'meta' | 'category' | 'branch'> & {
  category_id: string 
  branch_id: string
}


export interface createStockRequestPayload {
  branch: string
  employee: string
  note: string
  items: {
    item: string
    quantity: number
  }[]
}

export interface CreateInventoryItemPayload {
  category_id: string
  name: string
  description: string
  note: string
  unit: string
  quantity: number
  threshold: number
  expired_date: Date
}

export interface UpdateInventoryItemPayload {
  id: string
  name: string
  category_id: string
  description: string
  note: string
  unit: string
  quantity: number
  threshold: number
  expired_date: Date
}

export interface ApproveStockRequestPayload {
  id: string
  items: { 
    id: string, 
    status: 'Disetujui' | 'Ditolak' 
  }[]
  note: string
}