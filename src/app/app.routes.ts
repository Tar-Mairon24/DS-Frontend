import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardAdminComponent } from './dashboard/dashboard-admin.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard-admin', component: DashboardAdminComponent },
  { path: '**', redirectTo: 'login' }
];
