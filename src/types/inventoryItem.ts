import type { Branch } from "./branch"
import type { Employee } from "./employee"
import type { Meta } from "./meta"

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
  expireDate?: Date
  meta?: Meta
}

export interface StockMovement { 
  id: string
  name: string
  description?: string
  category?: Category
  branch?: Branch
  employee?: Employee
  quantity?: number
  unit?: string 
  status?: 'Masuk' | 'Keluar' 
  time?: Date
  meta?: Meta
}