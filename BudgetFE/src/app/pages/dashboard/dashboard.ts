import { Component, DestroyRef, inject, OnInit, computed } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { provideNativeDateAdapter } from '@angular/material/core';
import { CurrencyPipe } from '@angular/common';
import { BarChartModule, PieChartModule, Color, ScaleType } from '@swimlane/ngx-charts';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';
import { DashboardStore } from '../../shared/stores/dashboard.store';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    CurrencyPipe,
    BarChartModule,
    PieChartModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  readonly store = inject(DashboardStore);

  dateRange = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  barChartData = computed(() => {
    const s = this.store.summary();
    if (!s) return [];
    return (s.byMonth ?? []).map((m) => ({
      name: m.month,
      series: [
        { name: 'Przychody', value: m.income },
        { name: 'Wydatki', value: m.expenses },
      ],
    }));
  });

  pieChartData = computed(() => {
    const s = this.store.summary();
    if (!s) return [];
    return (s.byCategory ?? []).map((c) => ({
      name: c.category,
      value: c.totalAmount,
    }));
  });

  pieChartCustomColors = computed(() =>
    this.pieChartData().map((item) => ({
      name: item.name,
      value: this.categoryColorMap[item.name] ?? '#b9474d',
    })),
  );

  barChartColorScheme: Color = {
    name: 'income-expense',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#4caf50', '#f44336'],
  };
  pieChartColorScheme: Color = {
    name: 'categories',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: [
      '#4caf50',
      '#5fbf61',
      '#6bca70',
      '#7ed584',
      '#f44336',
      '#e13a44',
      '#cc3342',
      '#b9474d',
    ],
  };
  private readonly categoryColorMap: Record<string, string> = {
    Wynagrodzenie: '#4caf50',
    Freelance: '#5fbf61',
    Inwestycje: '#6bca70',
    Prezenty: '#7ed584',
    'Inne przychody': '#8de29b',
    Jedzenie: '#f44336',
    Transport: '#e13a44',
    Mieszkanie: '#cc3342',
    Rozrywka: '#ba2e3f',
    Zdrowie: '#a7293b',
    Edukacja: '#962537',
    Ubrania: '#852133',
    'Inne wydatki': '#741c2f',
  };

  ngOnInit(): void {
    this.store.load();

    this.dateRange.valueChanges
      .pipe(
        map((value) => ({
          start: this.formatDateOrNull(value.start),
          end: this.formatDateOrNull(value.end),
        })),
        debounceTime(350),
        distinctUntilChanged(
          (prev, current) => prev.start === current.start && prev.end === current.end,
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(({ start, end }) =>
        this.store.setDateRange(start ?? undefined, end ?? undefined),
      );
  }

  clearStartDate(event: MouseEvent): void {
    event.stopPropagation();
    this.dateRange.controls.start.setValue(null);
  }

  clearEndDate(event: MouseEvent): void {
    event.stopPropagation();
    this.dateRange.controls.end.setValue(null);
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private formatDateOrNull(date: Date | null | undefined): string | null {
    return date ? this.formatDate(date) : null;
  }
}
