import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { WelcomeComponent } from './welcome/welcome';
import { MfaComponent } from './mfa/mfa.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'mfa', component: MfaComponent },
  { path: 'welcome', component: WelcomeComponent },
  { path: '**', redirectTo: 'login' }
];
