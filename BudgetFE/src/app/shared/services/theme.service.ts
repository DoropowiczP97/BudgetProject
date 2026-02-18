import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, signal } from '@angular/core';

export type AppTheme = 'dark' | 'light';

const THEME_STORAGE_KEY = 'budget-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly themeState = signal<AppTheme>('dark');
  readonly theme = this.themeState.asReadonly();

  constructor(@Inject(DOCUMENT) private readonly document: Document) {
    this.initializeTheme();
  }

  toggleTheme(): void {
    const nextTheme: AppTheme = this.themeState() === 'dark' ? 'light' : 'dark';
    this.setTheme(nextTheme);
  }

  setTheme(theme: AppTheme): void {
    this.themeState.set(theme);
    this.applyTheme(theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }

  private initializeTheme(): void {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    const theme: AppTheme = savedTheme === 'light' ? 'light' : 'dark';
    this.themeState.set(theme);
    this.applyTheme(theme);
  }

  private applyTheme(theme: AppTheme): void {
    const body = this.document.body;
    body.classList.remove('theme-dark', 'theme-light');
    body.classList.add(theme === 'light' ? 'theme-light' : 'theme-dark');
  }
}
