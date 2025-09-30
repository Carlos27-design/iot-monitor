import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { AuthData } from '../services/auth-data';
import { inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export const authenticatedGuard: CanMatchFn = async (route: Route, segments: UrlSegment[]) => {
  const authData = inject(AuthData);
  const router = inject(Router);

  const isAuthenticated = await firstValueFrom(authData.checkStatus());

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return router.createUrlTree(['/login']);
  }

  return true;
};
