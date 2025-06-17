import type { Branch } from "./branch"

export type EmployeeActive = {
  branch: Branch
  active: number
  week: number[]
  month: number[]
}