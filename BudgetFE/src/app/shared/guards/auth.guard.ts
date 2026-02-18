import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import Keycloak from 'keycloak-js';

export const authGuard: CanActivateFn = async () => {
  const keycloak = inject(Keycloak);

  if (keycloak.authenticated) {
    return true;
  }

  await keycloak.login();
  return false;
};
