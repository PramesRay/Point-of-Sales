import type { IdName } from "./common"

export interface Branch {
  id: string
  name: string
  operational: {
    activity: {
      is_open: boolean
      opened_at: Date | null
      opened_by: IdName | null
    }
    open_time: string
    close_time: string
  }
  description: string
  address: string
  contact: string
}

export type UpdateBranchPayload = Omit<Branch, 'operational'> & {
  open_time: string
  close_time: string
}

export type CreateBranchPayload = Omit<UpdateBranchPayload, 'id'>