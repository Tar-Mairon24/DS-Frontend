import { Component, HostListener, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserStateService } from '@services/user-state.service';
import { MfaComponent } from '@auth/mfa/mfa.component';

@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [CommonModule, MfaComponent],
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css']
})
export class SideMenuComponent implements OnInit {
  private readonly MOBILE_BREAKPOINT = 768;
  private wasMobileViewport = false;

  @Input() propsRole: string = '';

  isCollapsed: boolean = false;
  propsEmail: string = '';
  userEmail: string = '';
  showMfa: boolean = false;
  pendingRoute: string = '';
  propsReason: string = '';

  constructor(
    private router: Router,
    private userStateService: UserStateService
  ) {}

  ngOnInit() {
    this.userEmail = this.userStateService.getUserEmail();
    this.syncCollapseWithViewport(true);
  }

  @HostListener('window:resize')
  onResize() {
    this.syncCollapseWithViewport(false);
  }

  private syncCollapseWithViewport(force: boolean): void {
    const isMobileViewport = window.innerWidth <= this.MOBILE_BREAKPOINT;

    if (force || isMobileViewport !== this.wasMobileViewport) {
      // Mobile: collapsed by default. Desktop: open by default.
      this.isCollapsed = isMobileViewport;
      this.wasMobileViewport = isMobileViewport;
    }
  }

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }

  // ── Navigation (no MFA needed) ──

  goDashboard() {
    this.router.navigate(['/dashboard']);
  }

  goCalendar() {
    this.router.navigate(['/calendar']);
  }

  goDocuments() {
    this.router.navigate(['/documents']);
  }

  goContact() {
    this.router.navigate(['/contact']);
  }

  // ── Navigation (MFA protected) ──

  goSettings() {
    this.navigateWithMfa('/configuracion', 'Abrir configuración');
  }

  goUsers() {
    this.navigateWithMfa('/dashboard', 'Abrir administración de usuarios');
  }

  // ── MFA flow ──

  private navigateWithMfa(route: string, reason: string) {
    this.propsEmail = this.userStateService.getUserEmail();
    this.pendingRoute = route;
    this.propsReason = reason;
    this.showMfa = true;
  }

  onMfaClose() {
    this.showMfa = false;
    this.pendingRoute = '';
  }

  onMfaVerified(code: string) {
    this.showMfa = false;
    this.userStateService.setMfaVerified(true);
    if (this.pendingRoute) {
      this.router.navigate([this.pendingRoute]);
      this.pendingRoute = '';
    }
  }

  // ── Auth ──

  logout() {
    this.userStateService.clearUserData();
    this.router.navigate(['/login']);
  }
}
