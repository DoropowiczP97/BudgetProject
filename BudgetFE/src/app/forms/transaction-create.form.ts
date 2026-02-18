import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TransactionType } from '../shared/models/transaction.model';
import { TransactionFormModel } from './transaction-form.model';

export function createTransactionCreateForm(): FormGroup<TransactionFormModel> {
  return new FormGroup<TransactionFormModel>({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    amount: new FormControl<number | null>(null, {
      validators: [Validators.required, Validators.min(0.01)],
    }),
    type: new FormControl(TransactionType.Expense, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    category: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    date: new FormControl(new Date(), {
      nonNullable: true,
      validators: [Validators.required],
    }),
    description: new FormControl('', {
      nonNullable: true,
    }),
  });
}

