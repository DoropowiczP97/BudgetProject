import { FormGroup } from '@angular/forms';
import { Transaction } from '../shared/models/transaction.model';
import { createTransactionCreateForm } from './transaction-create.form';
import { createTransactionEditForm } from './transaction-edit.form';
import { TransactionFormModel } from './transaction-form.model';

export type TransactionFormType = 'create' | 'edit';

export function createTransactionForm(
  type: TransactionFormType,
  transaction?: Transaction,
): FormGroup<TransactionFormModel> {
  if (type === 'edit' && transaction) {
    return createTransactionEditForm(transaction);
  }

  return createTransactionCreateForm();
}
