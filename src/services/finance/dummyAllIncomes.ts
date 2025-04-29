import dummyFinanceSummary from './dummyFinanceSummary';
import type { AllIncomes } from '@/types/finance';

/**
 * Dummy incomes: mapping branchId → income
 */
const dummyAllIncomes: AllIncomes = Object.fromEntries(
  Object.entries(dummyFinanceSummary).map(([branchId, data]) => [branchId, data.income])
);

export default dummyAllIncomes;