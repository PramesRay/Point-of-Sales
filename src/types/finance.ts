import type { Branch } from "./branch";
import type { IdName } from "./common";
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
  status: 'Pending' | 'Disetujui' | 'Ditolak',
  branch: IdName
  meta? : Meta
}

export type CreateFundRequest = Omit<FundRequest, 'id' | 'status' | 'branch' | 'employee' | 'meta'> & {
  branch_id: string
}
export type UpdateFundRequest = Omit<FundRequest, 'employee' | 'branch' | 'meta'> & {
  branch_id: string
}

export interface FinanceSummary {
  income: number
  expense: ExpenseSummary
  order: OrderSummary
  branchId: string,
  branchName: string
}