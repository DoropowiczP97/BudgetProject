import { bootstrapApplication } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';
import localePl from '@angular/common/locales/pl';
import { appConfig } from './app/app.config';
import { App } from './app/app';

registerLocaleData(localePl);

const savedTheme = localStorage.getItem('budget-theme');
document.body.classList.add(savedTheme === 'light' ? 'theme-light' : 'theme-dark');

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
