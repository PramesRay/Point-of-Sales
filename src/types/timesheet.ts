import type { Branch } from "./branch";
import type { Employee } from "./employee";

export type TimesheetData = {
  branch: Branch
  open_hour: number
  employee: Employee[]
}