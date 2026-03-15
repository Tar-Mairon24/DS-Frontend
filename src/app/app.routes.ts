import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DashboardComponent } from './properties/dashboard/dashboard.component';
import { DashboardAdminComponent } from './properties/dashboard-admin/dashboard-admin.component';
import { authGuard } from './auth/guards/auth.guard';
import { ConfiguracionComponent } from './shared/layout/configuracion/configuracion.component';
import { mfaGuard } from './auth/guards/mfa.guard';
import { ForbiddenComponent } from './auth/forbidden/forbidden.component';
import { loggedInGuard } from './auth/guards/logged-in.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [authGuard],
    data: { role: 'admin' }
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [loggedInGuard]
  },
  {
    path: 'dashboard-admin',
    component: DashboardAdminComponent,
    canActivate: [authGuard, mfaGuard],
    data: { role: 'admin' }
  },
  {
    path: 'configuracion',
    component: ConfiguracionComponent,
    canActivate: [loggedInGuard, mfaGuard]
  },
  {
    path: 'forbidden',
    component: ForbiddenComponent,
    canActivate: [loggedInGuard]
  },
  { path: '**', redirectTo: '/login' }
];
