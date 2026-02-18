export enum TransactionType {
  Income = 0,
  Expense = 1,
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
  'Inwestycje',
  'Prezenty',
  'Inne przychody',
] as const;
