import type { Branch } from "./branch"
import type { Category } from "./inventoryItem"
import type { Meta } from "./meta"

export interface Menu {
  id: string
  name: string
  description: string
  price: number
  quantity: number
  category: Category
  branch: Branch
  meta: Meta
}