import {
  ApplicationConfig,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';

import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth-interceptor';
import { io, Socket } from 'socket.io-client';

function createSocket(): Socket {
  return io('http://localhost:3000', {
    autoConnect: true,
    transports: ['websocket', 'polling'],
  });
}

import { InjectionToken } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

export const SOCKET_TOKEN = new InjectionToken<Socket>('socket.io');

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    provideRouter(routes),
    importProvidersFrom(MatDatepickerModule, MatNativeDateModule, ReactiveFormsModule),
    { provide: MAT_DATE_LOCALE, useValue: 'es-CL' }, // opcional, para formato español
    {
      provide: SOCKET_TOKEN,
      useFactory: createSocket,
    },
  ],
};
