import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import Keycloak from 'keycloak-js';
import { ConfirmDialogComponent, ConfirmDialogData } from '../confirm-dialog/confirm-dialog';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './layout.html',
  styleUrls: ['./layout.scss'],
})
export class LayoutComponent {
  private readonly keycloak = inject(Keycloak);
  private readonly dialog = inject(MatDialog);
  private readonly themeService = inject(ThemeService);

  navItems = [
    { label: 'Panel główny', route: '/dashboard', icon: 'dashboard' },
    { label: 'Transakcje', route: '/transactions', icon: 'receipt_long' },
  ];
  userEmail = this.getUserEmail();
  currentTheme = this.themeService.theme;

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  async changePassword(): Promise<void> {
    await this.keycloak.login({
      action: 'UPDATE_PASSWORD',
      redirectUri: window.location.href,
    });
  }

  deleteAccount(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      data: {
        title: 'Usuwanie konta',
        message: 'Czy na pewno chcesz przejsc do usuwania konta? Tej operacji nie da sie cofnac.',
      } as ConfirmDialogData,
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (!confirmed) {
        return;
      }

      const accountUrl = this.keycloak.createAccountUrl();
      window.location.assign(`${accountUrl}#/personal-info`);
    });
  }

  logout(): void {
    this.keycloak.logout();
  }

  private getUserEmail(): string {
    const claims = this.keycloak.tokenParsed as Record<string, unknown> | undefined;
    const email = claims?.['email'];
    if (typeof email === 'string' && email.length > 0) {
      return email;
    }

    const username = claims?.['preferred_username'];
    if (typeof username === 'string' && username.length > 0) {
      return username;
    }

    const subject = claims?.['sub'];
    if (typeof subject === 'string' && subject.length > 0) {
      return subject;
    }

    return 'Uzytkownik';
  }
}
