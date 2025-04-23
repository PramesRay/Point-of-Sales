import type { Employee } from "./employee";

export type TimesheetData = {
  open_hour: number
  employee: Employee[]
}