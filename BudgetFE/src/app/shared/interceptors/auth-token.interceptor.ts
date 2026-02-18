import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import Keycloak from 'keycloak-js';
import { environment } from '../../../environments/environment';
import { catchError, from, of, switchMap } from 'rxjs';

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  if (!isApiRequest(req.url) || req.headers.has('Authorization')) {
    return next(req);
  }

  const keycloak = inject(Keycloak);

  return from(keycloak.updateToken(30)).pipe(
    catchError(() => of(false)),
    switchMap(() => {
      const token = keycloak.token;
      if (!token) {
        return next(req);
      }

      return next(
        req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        }),
      );
    }),
  );
};

function isApiRequest(url: string): boolean {
  const keycloakAccountPrefix = `${environment.keycloak.url}/realms/${environment.keycloak.realm}/account`;

  return (
    url.startsWith('/api') ||
    url.startsWith(environment.apiUrl) ||
    url.startsWith('http://localhost:5000/api') ||
    url.startsWith(keycloakAccountPrefix)
  );
}
