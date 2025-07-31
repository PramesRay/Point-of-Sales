import dummyFinanceSummary from './dummyFinanceSummary';
import type { AllIncomes } from '@/types/finance';

/**
 * Dummy incomes: mapping branchId → income
 */
const incomes = dummyFinanceSummary.map(item => ({ income: item.income }));

export default incomes;