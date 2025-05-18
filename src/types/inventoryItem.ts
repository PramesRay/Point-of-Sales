import type { Branch } from "./branch"
import type { Employee } from "./employee"
import type { Meta } from "./meta"

export interface InventoryCategory {
  id: string
  name: string
  description?: string
  meta?: Meta
}
export interface InventoryItem {
  id: string
  name: string
  description?: string
  category?: InventoryCategory
  quantity?: number
  threshold?: number
  expireDate?: Date
  meta?: Meta
}

export interface StockMovement { 
  id: string
  name: string
  description?: string
  category?: InventoryCategory
  branch?: Branch
  employee?: Employee
  quantity?: number
  unit?: string 
  status?: 'Masuk' | 'Keluar' 
  time?: Date
  meta?: Meta
}

export interface Item {
  id: string
  name: string
}