import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { TransactionService } from '../services/transaction.service';
import { TransactionsSummary } from '../models/transaction-summary.model';

interface DashboardState {
  summary: TransactionsSummary | null;
  loading: boolean;
  dateFrom: string | undefined;
  dateTo: string | undefined;
}

export const DashboardStore = signalStore(
  { providedIn: 'root' },
  withState<DashboardState>({
    summary: null,
    loading: false,
    dateFrom: undefined,
    dateTo: undefined,
  }),
  withMethods((store, service = inject(TransactionService)) => {
    function load(): void {
      patchState(store, { loading: true });
      service.getSummary(store.dateFrom(), store.dateTo()).subscribe({
        next: (summary) => patchState(store, { summary, loading: false }),
        error: () => patchState(store, { loading: false }),
      });
    }

    return {
      load,
      setDateRange(dateFrom: string | undefined, dateTo: string | undefined): void {
        patchState(store, { dateFrom, dateTo });
        load();
      },
    };
  }),
);
