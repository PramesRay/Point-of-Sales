import type { IdName } from "./common"

export type EmployeeActive = {
  branch: IdName
  current: number
  week: number[]
  month: number[]
}