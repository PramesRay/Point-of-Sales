import type { Branch } from "./branch";
import type { IdName } from "./common";
import type { InventoryItem } from "./inventory";
import type { Meta } from "./meta";

export type AllIncomes = Record<string, number>;

export interface OrderSummary {
  current: number
  week: number[]
  month: number[]
}

export type PeriodKey = 'today' | 'week' | 'month' | 'year'

export interface ExpenseChartData {
  categories: string[]
  series: Array<{
    name: string    // misal: 'Belanja Stok', 'Lain-lain'
    data: number[]
  }>
}

export interface ExpenseSummary {
  totalExpense: Record<PeriodKey, number>
  chartData: Record<PeriodKey, ExpenseChartData>
}

export interface Transaction {
  name: string,
  type: 'income' | 'expense',
  subject: string,
  price: number,
  date: Date,
  branchId: string,
  branchName: string
}

export interface FundRequest {
  id: string,
  subject: string,
  notes: string,
  employee: IdName,
  amount: number,
  items: {
      item: Pick<InventoryItem, 'id' | 'name' | 'purchase_price' | 'unit'>
      status: 'Disetujui' | 'Ditolak' | 'Pending';
      quantity: number
    }[]
    status: 'Disetujui'| 'Beberapa Disetujui' | 'Ditolak' | 'Pending';
  branch: IdName
  approvement: {
    by: IdName[]
    note: string
  }
  meta? : Meta
}

export type CreateFundRequest = Omit<FundRequest, 'id' | 'status' | 'branch' | 'employee' | 'items' | 'approvement' | 'meta'> & {
  branch_id: string
  items: {
    item_id: string
    quantity: number
  }[]
}
export type UpdateFundRequest = Omit<FundRequest, 'employee' | 'branch' | 'items' | 'approvement' | 'meta'> & {
  branch_id: string
  items: {
    item_id: string
    quantity: number
  }[]
  approvement_note: string
}

export interface FinanceSummary {
  income: number
  expense: ExpenseSummary
  order: OrderSummary
  branchId: string,
  branchName: string
}