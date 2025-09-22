import type { IdName } from "./common"
import type { Employee } from "./employee"

export interface Meta {
  created_at: Date
  updated_at: Date
}

export interface MetaDetail extends Meta {
  created_by: IdName
  last_updated_by: IdName
}