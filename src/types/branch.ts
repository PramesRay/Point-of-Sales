import type { IdName } from "./common"
import type { MetaDetail } from "./meta"
import type { ShiftCashier, ShiftKitchen } from "./shift"

export interface Branch {
  id: string
  name: string
  operational: {
    activity: {
      shift_cashier: Omit<ShiftCashier, 'branch'>
      shift_kitchen: Omit<ShiftKitchen, 'branch'>
      is_active: boolean;
      last_active: Date;
    }
    open_time: string
    close_time: string
  }
  description: string
  address: string
  contact: string
  meta: MetaDetail
}

export type UpdateBranchPayload = Omit<Branch, 'operational' | 'meta'> & {
  open_time: string
  close_time: string
}

export type CreateBranchPayload = Omit<UpdateBranchPayload, 'id'>