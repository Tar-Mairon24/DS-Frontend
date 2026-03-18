import { Routes } from '@angular/router';
import { LoginComponent } from '@auth/login/login.component';
import { RegisterComponent } from '@auth/register/register.component';
import { ForbiddenComponent } from '@auth/forbidden/forbidden.component';
import { MainLayoutComponent } from '@shared/layout/main-layout/main-layout.component';
import { DashboardComponent } from '@properties/dashboard/dashboard.component';
import { ConfiguracionComponent } from '@pages/profile/configuracion/configuracion.component';
import { authGuard } from '@auth/guards/auth.guard';
import { mfaGuard } from '@auth/guards/mfa.guard';
import { loggedInGuard } from '@auth/guards/logged-in.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [loggedInGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      {
        path: 'configuracion',
        component: ConfiguracionComponent,
        canActivate: [mfaGuard]
      },
      // Add your new pages here as you build them:
      // { path: 'properties', component: PropertiesComponent },
      // { path: 'calendar', component: CalendarComponent },
      // { path: 'documents', component: DocumentsComponent },
      // { path: 'contact', component: ContactComponent },
    ]
  },

  // Admin-only routes (also inside the shell)
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [loggedInGuard, authGuard],
    data: { role: 'admin' },
    children: [
      { path: 'register', component: RegisterComponent },
    ]
  },

  { path: 'forbidden', component: ForbiddenComponent },
  { path: '**', redirectTo: '/login' }
];
