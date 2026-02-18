export interface MonthlySummary {
  month: string;
  income: number;
  expenses: number;
}

export interface CategorySummary {
  category: string;
  totalAmount: number;
  type: number;
}

export interface TransactionsSummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  byMonth: MonthlySummary[];
  byCategory: CategorySummary[];
}
