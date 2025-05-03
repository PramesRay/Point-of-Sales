import type { Branch } from "./branch";
import type { Employee } from "./employee";
import type { InventoryItem } from "./inventoryItem";
import type { Meta } from "./Meta";

export interface StockRequestSummary {
  branch: Branch;
  summary: {
    request: number
    week: number[]
    month: number[]
  }
}

export interface StockRequestList {
  id: string;
  branch: Branch;
  employee: Employee;
  items: {
    item: InventoryItem
    status: 'Disetujui' | 'Ditolak' | 'Pending';
  }[]
  status: 'Disetujui'| 'Beberapa Disetujui' | 'Ditolak' | 'Pending';
  note: string;
  time: Meta
}