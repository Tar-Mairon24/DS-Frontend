import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserStateService } from '../services/user-state.service';
import { MfaComponent } from '../mfa/mfa.component';

@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [CommonModule, MfaComponent],
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css']
})
export class SideMenuComponent {

  constructor(
    private router: Router,
    private userStateService: UserStateService
  ) {}

  @Input() propsRole: string = '';
  propsEmail: string = '';
  showMfa: boolean = false;
  pendingRoute: string = '';
  propsReason: string = '';

  logout() {
    this.userStateService.clearUserData();
    this.router.navigate(['/login']);
  }

  goDashboardAdmin() {
    this.propsEmail = this.userStateService.getUserEmail();
    this.pendingRoute = '/dashboard-admin';
    this.propsReason = 'Abrir administración de usuarios';
    this.showMfa = true;
  }

  goDashboard() {
    this.router.navigate(['/dashboard']);
  }

  goSettings() {
    this.propsEmail = this.userStateService.getUserEmail();
    this.pendingRoute = '/configuracion';
    this.propsReason = 'Abrir configuración';
    this.showMfa = true;
  }

  onMfaClose() {
    this.showMfa = false;
    this.pendingRoute = '';
  }

  onMfaVerified(code: string) {
    console.log('MFA verificado con código:', code);
    this.showMfa = false;

    this.userStateService.setMfaVerified(true);

    if (this.pendingRoute) {
      this.router.navigate([this.pendingRoute]);
      this.pendingRoute = '';
    }
  }
}
