import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { AuthData } from '../services/auth-data';
import { inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export const noAuthenticatedGuard: CanMatchFn = async (route: Route, segments: UrlSegment[]) => {
  const authData = inject(AuthData);
  const router = inject(Router);

  const isAuthenticated = await firstValueFrom(authData.checkStatus());

  if (isAuthenticated) {
    return router.createUrlTree(['/dashboard']);
  }

  return true;
};
