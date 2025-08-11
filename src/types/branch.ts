import type { IdName } from "./common"
import type { Meta, MetaDetail } from "./meta"
import type { ShiftCashier, ShiftKitchen } from "./shift"

export interface Branch {
  id: string
  name: string
  operational: {
    is_active: boolean
    open_time: string
    close_time: string
  }
  description: string
  address: string
  contact: string
  meta: Meta
}