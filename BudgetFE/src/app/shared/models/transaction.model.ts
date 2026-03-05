export enum TransactionType {
  Income = 0,
  Expense = 1,
  Investment = 2,
}

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  description?: string;
}

export const EXPENSE_CATEGORIES = [
  'Jedzenie',
  'Transport',
  'Mieszkanie',
  'Rozrywka',
  'Zdrowie',
  'Edukacja',
  'Ubrania',
  'Inne wydatki',
] as const;

export const INCOME_CATEGORIES = [
  'Wynagrodzenie',
  'Freelance',
  'Prezenty',
  'Inne przychody',
] as const;

export const INVESTMENT_CATEGORIES = [
  'Akcje',
  'Kryptowaluty',
  'Fundusze ETF',
  'Obligacje',
  'Nieruchomości',
  'Inne inwestycje',
] as const;
