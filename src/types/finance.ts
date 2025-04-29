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
  request: string,
  name: string,
  price: number,
  date: Date,
  status: 'Pending' | 'Disetujui' | 'Ditolak',
  branchId: string,
  branchName: string
}

export interface FinanceSummary {
  income: number
  expense: ExpenseSummary
  order: OrderSummary
  branchId: string,
  branchName: string
}