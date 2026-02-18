import { FormControl } from '@angular/forms';
import { TransactionType } from '../shared/models/transaction.model';

export interface TransactionFormModel {
  title: FormControl<string>;
  amount: FormControl<number | null>;
  type: FormControl<TransactionType>;
  category: FormControl<string>;
  date: FormControl<Date>;
  description: FormControl<string>;
}

