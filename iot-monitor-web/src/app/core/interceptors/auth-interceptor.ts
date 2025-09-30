import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { AuthData } from '../services/auth-data';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const token = inject(AuthData).token();

  const newReq = req.clone({
    headers: req.headers.append(`Authorization`, `Bearer ${token}`),
  });

  return next(newReq);
};
