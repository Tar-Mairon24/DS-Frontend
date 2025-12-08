import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardAdminComponent } from './dashboard-admin/dashboard-admin.component';
import { authGuard } from './guards/auth.guard';
import { ConfiguracionComponent } from './configuracion/configuracion.component';
import { mfaGuard } from './guards/mfa.guard';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { loggedInGuard } from './guards/logged-in.guard';

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
