import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import {
  Transaction,
  TransactionType,
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
} from '../../../shared/models/transaction.model';
import { createTransactionForm } from '../../../forms/form-factory';
import { TransactionFormModel } from '../../../forms/transaction-form.model';

export interface TransactionDialogData {
  transaction?: Transaction;
}

@Component({
  selector: 'app-transaction-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './transaction-dialog.html',
  styleUrl: './transaction-dialog.scss',
})
export class TransactionDialogComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<TransactionDialogComponent>);
  readonly data = inject<TransactionDialogData>(MAT_DIALOG_DATA);

  form!: FormGroup<TransactionFormModel>;
  isEditMode = false;
  categories: readonly string[] = [];

  transactionTypes = [
    { value: TransactionType.Income, label: 'Przychód' },
    { value: TransactionType.Expense, label: 'Wydatek' },
  ];

  ngOnInit(): void {
    this.isEditMode = !!this.data?.transaction;
    this.form = createTransactionForm(
      this.isEditMode ? 'edit' : 'create',
      this.data?.transaction,
    );

    this.updateCategories(this.form.controls.type.value);

    this.form.controls.type.valueChanges.subscribe((type) => {
      this.updateCategories(type);
      this.form.controls.category.setValue('');
    });
  }

  get dialogTitle(): string {
    return this.isEditMode ? 'Edytuj transakcję' : 'Dodaj transakcję';
  }

  save(): void {
    if (this.form.invalid) {
      return;
    }

    const value = this.form.getRawValue();
    const result = {
      ...value,
      amount: value.amount as number,
      date: value.date.toISOString().split('T')[0],
    };

    if (this.isEditMode && this.data.transaction) {
      this.dialogRef.close({ ...result, id: this.data.transaction.id });
      return;
    }

    this.dialogRef.close(result);
  }

  private updateCategories(type: TransactionType): void {
    this.categories = type === TransactionType.Income ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  }
}
