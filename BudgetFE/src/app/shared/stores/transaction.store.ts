import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Transaction } from '../models/transaction.model';
import {
  CreateTransactionRequest,
  GetTransactionsParams,
  TransactionService,
  UpdateTransactionRequest,
} from '../services/transaction.service';

interface TransactionState {
  transactions: Transaction[];
  totalCount: number;
  pageSize: number;
  pageIndex: number;
  sortBy: string;
  sortDirection: string;
  searchTerm: string;
  loading: boolean;
}

export const TransactionStore = signalStore(
  { providedIn: 'root' },
  withState<TransactionState>({
    transactions: [],
    totalCount: 0,
    pageSize: 10,
    pageIndex: 0,
    sortBy: 'date',
    sortDirection: 'desc',
    searchTerm: '',
    loading: false,
  }),
  withMethods((store, service = inject(TransactionService)) => {
    function load(): void {
      patchState(store, { loading: true });
      const params: GetTransactionsParams = {
        pageNumber: store.pageIndex() + 1,
        pageSize: store.pageSize(),
        sortBy: store.sortBy(),
        sortDirection: store.sortDirection(),
        searchTerm: store.searchTerm() || undefined,
      };
      service.getTransactions(params).subscribe({
        next: (result) =>
          patchState(store, {
            transactions: result.items,
            totalCount: result.totalCount,
            loading: false,
          }),
        error: () => patchState(store, { loading: false }),
      });
    }

    return {
      load,
      setPage(pageIndex: number, pageSize: number): void {
        patchState(store, { pageIndex, pageSize });
        load();
      },
      setSort(sortBy: string, sortDirection: string): void {
        patchState(store, { sortBy, sortDirection, pageIndex: 0 });
        load();
      },
      setSearch(searchTerm: string): void {
        patchState(store, { searchTerm, pageIndex: 0 });
        load();
      },
      create(
        request: CreateTransactionRequest,
        onSuccess?: () => void,
        onError?: () => void,
      ): void {
        service.create(request).subscribe({
          next: () => {
            load();
            onSuccess?.();
          },
          error: () => onError?.(),
        });
      },
      update(
        id: string,
        request: UpdateTransactionRequest,
        onSuccess?: () => void,
        onError?: () => void,
      ): void {
        service.update(id, request).subscribe({
          next: () => {
            load();
            onSuccess?.();
          },
          error: () => onError?.(),
        });
      },
      delete(id: string, onSuccess?: () => void, onError?: () => void): void {
        service.delete(id).subscribe({
          next: () => {
            load();
            onSuccess?.();
          },
          error: () => onError?.(),
        });
      },
    };
  }),
);
