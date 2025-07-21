import type { IdName } from "./common"

export type EmployeeActive = {
  branch: IdName
  active: number
  week: number[]
  month: number[]
}