import { authenticatedGuard } from './core/guards/authenticated-guard';
import { noAuthenticatedGuard } from './core/guards/no-authenticated-guard';
import { LayoutAuth } from './layouts/layout-auth/layout-auth';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    component: LayoutAuth,

    children: [
      {
        path: 'login',
        canMatch: [noAuthenticatedGuard],
        loadComponent: () =>
          import('./feature/auth/login-page/login-page').then((c) => c.LoginPage),
      },
      {
        path: 'register',
        canMatch: [noAuthenticatedGuard],
        loadComponent: () =>
          import('./feature/auth/register-page/register-page').then((c) => c.RegisterPage),
      },
    ],
  },
  {
    path: 'dashboard',
    canMatch: [authenticatedGuard],
    loadComponent: () =>
      import('./layouts/layout-dashboard/layout-dashboard').then((c) => c.LayoutDashboard),
    children: [
      {
        path: 'device-metric/:id',
        loadComponent: () =>
          import('./feature/device-metric-page/device-metric-page').then((c) => c.DeviceMetricPage),
      },
      {
        path: 'device-metric/alerts/:id',
        loadComponent: () =>
          import('./feature/device-metric-page/components/table-alerts/table-alerts').then(
            (c) => c.TableAlerts
          ),
      },
      {
        path: 'device-metric/metrics/:id',
        loadComponent: () =>
          import('./feature/device-metric-page/components/table-metrics/table-metrics').then(
            (c) => c.TableMetrics
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'auth/login',
  },
];
