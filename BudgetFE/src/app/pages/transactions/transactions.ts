import { Component, DestroyRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSortModule, MatSort, Sort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { Transaction, TransactionType } from '../../shared/models/transaction.model';
import {
  TransactionService,
  CreateTransactionRequest,
  UpdateTransactionRequest,
} from '../../shared/services/transaction.service';
import {
  TransactionDialogComponent,
  TransactionDialogData,
} from './transaction-dialog/transaction-dialog';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from '../../shared/components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatCardModule,
    MatChipsModule,
    CurrencyPipe,
    DatePipe,
    NgClass,
    AsyncPipe,
  ],
  templateUrl: './transactions.html',
  styleUrl: './transactions.scss',
})
export class TransactionsComponent implements OnInit {
  private readonly transactionService = inject(TransactionService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly destroyRef = inject(DestroyRef);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns = ['date', 'title', 'category', 'type', 'amount', 'actions'];
  transactions = signal<Transaction[]>([]);
  totalCount = signal(0);
  pageSize = signal(10);
  pageIndex = signal(0);
  sortBy = signal('date');
  sortDirection = signal('desc');
  searchTerm = signal('');
  loading = signal(true);
  searchControl = new FormControl('', { nonNullable: true });

  isMobile$ = this.breakpointObserver
    .observe([Breakpoints.Handset])
    .pipe(map((result) => result.matches));

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.searchTerm.set(value.trim());
        this.pageIndex.set(0);
        this.loadTransactions();
      });

    this.loadTransactions();
  }

  clearSearch(): void {
    this.searchControl.setValue('');
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loadTransactions();
  }

  onSortChange(sort: Sort): void {
    this.sortBy.set(sort.active);
    this.sortDirection.set(sort.direction || 'asc');
    this.pageIndex.set(0);
    this.loadTransactions();
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(TransactionDialogComponent, {
      width: '760px',
      maxWidth: '96vw',
      data: {} as TransactionDialogData,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const request: CreateTransactionRequest = {
          title: result.title,
          amount: result.amount,
          type: result.type,
          category: result.category,
          date: result.date,
          description: result.description,
        };
        this.transactionService.create(request).subscribe({
          next: () => {
            this.snackBar.open('Transakcja została dodana', 'OK', { duration: 3000 });
            this.loadTransactions();
          },
          error: () => {
            this.snackBar.open('Błąd podczas dodawania transakcji', 'OK', { duration: 3000 });
          },
        });
      }
    });
  }

  openEditDialog(transaction: Transaction): void {
    const dialogRef = this.dialog.open(TransactionDialogComponent, {
      width: '760px',
      maxWidth: '96vw',
      data: { transaction } as TransactionDialogData,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const request: UpdateTransactionRequest = {
          id: result.id,
          title: result.title,
          amount: result.amount,
          type: result.type,
          category: result.category,
          date: result.date,
          description: result.description,
        };
        this.transactionService.update(result.id, request).subscribe({
          next: () => {
            this.snackBar.open('Transakcja została zaktualizowana', 'OK', { duration: 3000 });
            this.loadTransactions();
          },
          error: () => {
            this.snackBar.open('Błąd podczas aktualizacji transakcji', 'OK', { duration: 3000 });
          },
        });
      }
    });
  }

  openDeleteDialog(transaction: Transaction): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Usuwanie transakcji',
        message: `Czy na pewno chcesz usunąć transakcję "${transaction.title}"?`,
      } as ConfirmDialogData,
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.transactionService.delete(transaction.id).subscribe({
          next: () => {
            this.snackBar.open('Transakcja została usunięta', 'OK', { duration: 3000 });
            this.loadTransactions();
          },
          error: () => {
            this.snackBar.open('Błąd podczas usuwania transakcji', 'OK', { duration: 3000 });
          },
        });
      }
    });
  }

  getTypeLabel(type: TransactionType): string {
    return type === TransactionType.Income ? 'Przychód' : 'Wydatek';
  }

  getTypeClass(type: TransactionType): string {
    return type === TransactionType.Income ? 'type-income' : 'type-expense';
  }

  private loadTransactions(): void {
    this.loading.set(true);
    this.transactionService
      .getTransactions({
        pageNumber: this.pageIndex() + 1,
        pageSize: this.pageSize(),
        sortBy: this.sortBy(),
        sortDirection: this.sortDirection(),
        searchTerm: this.searchTerm() || undefined,
      })
      .subscribe({
        next: (result) => {
          this.transactions.set(result.items);
          this.totalCount.set(result.totalCount);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        },
      });
  }
}
