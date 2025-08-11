import type { Branch } from "./branch";
import type { Employee } from "./user";

export type TimesheetData = {
  branch: Pick<Branch, 'id' | 'name' | 'operational'>
  employee: Employee[]
}