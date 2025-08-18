import type { Branch } from "./branch"
import type { IdName } from "./common"
import type { Category } from "./inventory"
import type { Meta } from "./meta"

export interface Menu {
  id: string
  name: string
  description: string
  price: number
  category: Category
  branch: IdName
  meta: Meta
}

export interface MenuSale extends Menu {
  quantity: number
  threshold: number
} 

export type CreateMenuPayload = Omit<Menu, "id" | "category" | "branch" | "meta"> & {
  category_id: string
  branch: string[]
}

export type UpdateMenuPayload = Omit<Menu, "category" | "branch" | "meta"> & {
  category_id: string
  branch_id: string
}

export type RestockMenuSalesPayload = (Pick<MenuSale, "id" | "quantity"> & {
  branch_id: string
})[]