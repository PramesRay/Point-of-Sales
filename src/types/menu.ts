import type { Branch } from "./branch"
import type { Category } from "./inventory"
import type { Meta } from "./meta"

export interface Menu {
  id: string
  name: string
  description: string
  price: number
  category: Category
  available_in_branch: Branch[]
  meta: Meta
}

export interface MenuSale extends Menu {
  quantity: number
  threshold: number
} 

export type CreateMenuPayload = Omit<Menu, "id" | "category" | "available_in_branch" | "meta"> & {
  category_id: string
  available_in_branch_id: string[]
}

export type UpdateMenuPayload = Omit<Menu, "category" | "available_in_branch" | "meta"> & {
  category_id: string
  available_in_branch_id: string[]
}