import type { IdName } from "./common"
import type { Employee } from "./employee"

export interface Meta {
  created_at: Date
  updated_at: Date | null
}

export interface MetaDetail extends Meta {
  created_by: IdName
  last_updated_by: IdName
}