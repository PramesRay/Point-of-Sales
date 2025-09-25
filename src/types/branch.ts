import type { Meta } from "./meta"

export interface Branch {
  id: string
  name: string
  operational: {
    activity: {
      is_active: boolean
    }
    open_time: string
    close_time: string
  }
  description: string
  address: string
  contact: string
  meta: Meta
}