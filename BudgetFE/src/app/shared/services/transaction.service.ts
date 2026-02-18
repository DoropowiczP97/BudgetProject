import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Transaction } from '../models/transaction.model';
import { PaginatedResult } from '../models/paginated-result.model';
import { TransactionsSummary } from '../models/transaction-summary.model';

export interface GetTransactionsParams {
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: string;
  searchTerm?: string;
  dateFrom?: string;
  dateTo?: string;
  type?: number;
  category?: string;
}

export interface CreateTransactionRequest {
  title: string;
  amount: number;
  type: number;
  category: string;
  date: string;
  description?: string;
}

export interface UpdateTransactionRequest extends CreateTransactionRequest {
  id: string;
}

interface BackendTransactionsSummary {
  totalIncome?: number;
  totalExpense?: number;
  totalExpenses?: number;
  balance?: number;
  monthlySummaries?: Array<{ month: string; income: number; expenses: number }>;
  byMonth?: Array<{ month: string; income: number; expenses: number }>;
  expensesByCategory?: Array<{ category: string; total: number; totalAmount?: number; type?: number }>;
  byCategory?: Array<{ category: string; totalAmount: number; type: number }>;
}

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/transactions`;

  getTransactions(params: GetTransactionsParams = {}): Observable<PaginatedResult<Transaction>> {
    let httpParams = new HttpParams();

    if (params.pageNumber) httpParams = httpParams.set('page', params.pageNumber);
    if (params.pageSize) httpParams = httpParams.set('pageSize', params.pageSize);
    if (params.sortBy) httpParams = httpParams.set('sortBy', params.sortBy);
    if (params.sortDirection) httpParams = httpParams.set('sortDesc', params.sortDirection === 'desc');
    if (params.searchTerm) httpParams = httpParams.set('searchTerm', params.searchTerm);
    if (params.dateFrom) httpParams = httpParams.set('dateFrom', params.dateFrom);
    if (params.dateTo) httpParams = httpParams.set('dateTo', params.dateTo);
    if (params.type !== undefined) httpParams = httpParams.set('type', params.type);
    if (params.category) httpParams = httpParams.set('category', params.category);

    return this.http.get<PaginatedResult<Transaction>>(this.baseUrl, { params: httpParams });
  }

  getSummary(dateFrom?: string, dateTo?: string): Observable<TransactionsSummary> {
    let httpParams = new HttpParams();
    if (dateFrom) httpParams = httpParams.set('dateFrom', dateFrom);
    if (dateTo) httpParams = httpParams.set('dateTo', dateTo);

    return this.http.get<BackendTransactionsSummary>(`${this.baseUrl}/summary`, { params: httpParams }).pipe(
      map((summary) => ({
        totalIncome: summary.totalIncome ?? 0,
        totalExpenses: summary.totalExpenses ?? summary.totalExpense ?? 0,
        balance: summary.balance ?? 0,
        byMonth: summary.byMonth ?? summary.monthlySummaries ?? [],
        byCategory: summary.byCategory ?? (summary.expensesByCategory ?? []).map((item) => ({
          category: item.category,
          totalAmount: item.totalAmount ?? item.total ?? 0,
          type: item.type ?? 0,
        })),
      })),
    );
  }

  create(request: CreateTransactionRequest): Observable<Transaction> {
    return this.http.post<Transaction>(this.baseUrl, request);
  }

  update(id: string, request: UpdateTransactionRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, request);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
