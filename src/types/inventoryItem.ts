import type { Meta } from "./Meta"

export interface InventoryItem {
  id: string
  name: string
  description?: string
  quantity?: number
  threshold?: number
  meta?: Meta
}