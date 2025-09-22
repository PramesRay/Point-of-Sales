import type { Branch } from "./branch";
import type { IdName } from "./common";
import type { InventoryItem } from "./inventory";
import type { Meta, MetaDetail } from "./meta";

export type AllIncomes = Record<string, number>;

export interface OrderSummary {
  current: number
  week: number[]
  month: number[]
}

export type PeriodKey = 'today' | 'week' | 'month' | 'year'

export interface Income {
  grossSales: number
  refunds: number
  netIncome: number
}

export interface IncomesSummary {
  period: {
    start: Date
    end: Date
  }
  total: Income
  perBranch: (Income & { branch_id: string })[]
}

export interface ExpenseChartData {
  categories: string[]
  series: Array<{
    name: string    // misal: 'Belanja Stok', 'Lain-lain'
    data: number[]
  }>
}

export interface ExpenseSummary {
  totalExpenses: Record<PeriodKey, number>
  chartData: Record<PeriodKey, ExpenseChartData>
}

export interface Transaction {
  id: string,
  subject: string,
  notes: string,
  is_income: boolean,
  employee: IdName,
  amount: number,
  date: Date,
  branch: IdName
  meta: Meta
}

export type CreateTransactionPayload = Omit<Transaction, 'id' | 'branch' | 'employee' | 'meta'> & {
  branch_id: string
}

export type UpdateTransactionPayload = Omit<Transaction, 'branch' | 'employee' | 'meta'> & {
  branch_id: string
}

export interface FundRequest {
  id: string,
  subject: string,
  description: string,
  shift_warehouse_id: string,
  branch: IdName
  items: {
    item: Pick<InventoryItem, 'id' | 'name' | 'purchase_price' | 'unit'>
    status: 'Disetujui' | 'Ditolak' | 'Pending';
    quantity: number
  }[]
  status: 'Disetujui'| 'Beberapa Disetujui' | 'Ditolak' | 'Pending';
  amount: number,
  total_approved: number | null,
  approval_notes: string
  meta : MetaDetail
}

export type CreateFundRequest = Pick<FundRequest, 'subject' | 'description'> & {
  items: {
    id: string
    quantity: number
  }[],
  amount: number
}
export type UpdateFundRequest = CreateFundRequest & {
  id: string
}

export type ApproveFundRequest = Pick<FundRequest, 'id' | 'approval_notes' | 'total_approved' > & {
  items: {
    id: string
    approved: boolean
  }[]
}

export interface FinanceSummary {
  income: IncomesSummary
  expenses: ExpenseSummary
  order: OrderSummary
  branch: IdName
}