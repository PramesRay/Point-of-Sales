import type { IdName } from "./common"
import type { Meta } from "./meta"

export interface Menu {
  id: string
  name: string
  description: string
  price: number
  category: IdName
  quantity: number
  threshold: number
}