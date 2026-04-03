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
import { NewPropertyComponent } from '@properties/new-property/new-property.component';
import { UpdatePropertyComponent } from '@properties/update-property/update-property.component';
import { PropertyDetailComponent } from '@properties/property-detail/property-detail.component';
import { CalendarComponent } from '@pages/calendar/calendar.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [loggedInGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'configuracion', component: ConfiguracionComponent },
      { path: 'properties/new-property', component: NewPropertyComponent },
      { path: 'properties/update/:id', component: UpdatePropertyComponent },
      { path: 'properties/:id', component: PropertyDetailComponent },
      { path: 'calendar', component: CalendarComponent}
    ]
  },

  // Admin-only routes
  {
    path: 'admin',
    component: MainLayoutComponent,
    canActivate: [loggedInGuard, authGuard],
    data: { role: 'admin' },
    children: [
      { path: 'register', component: RegisterComponent },
      // ... other admin routes
    ]
  },

  { path: 'forbidden', component: ForbiddenComponent },
  { path: '**', redirectTo: '/login' }
];
