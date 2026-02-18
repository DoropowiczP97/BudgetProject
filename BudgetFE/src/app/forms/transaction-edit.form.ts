import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Transaction, TransactionType } from '../shared/models/transaction.model';
import { TransactionFormModel } from './transaction-form.model';

export function createTransactionEditForm(
  transaction: Transaction,
): FormGroup<TransactionFormModel> {
  return new FormGroup<TransactionFormModel>({
    title: new FormControl(transaction.title, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    amount: new FormControl(transaction.amount, {
      validators: [Validators.required, Validators.min(0.01)],
    }),
    type: new FormControl(transaction.type ?? TransactionType.Expense, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    category: new FormControl(transaction.category, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    date: new FormControl(new Date(transaction.date), {
      nonNullable: true,
      validators: [Validators.required],
    }),
    description: new FormControl(transaction.description ?? '', {
      nonNullable: true,
    }),
  });
}

