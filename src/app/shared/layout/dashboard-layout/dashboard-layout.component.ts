import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SideMenuComponent } from '@shared/layout/side-menu/side-menu.component';
import { UserStateService } from '@services/user-state.service';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, SideMenuComponent],
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.css']
})
export class DashboardLayoutComponent {
  showLogoutConfirm = false;
  userRole: string = '';

  constructor(
    private router: Router,
    private userStateService: UserStateService
  ) {
    this.userRole = this.userStateService.getUserRole();
  }

  onLogoutRequest(): void {
    this.showLogoutConfirm = true;
  }

  onLogoutConfirm(): void {
    this.userStateService.clearUserData();
    this.router.navigate(['/login']);
    this.showLogoutConfirm = false;
  }

  onLogoutCancel(): void {
    this.showLogoutConfirm = false;
  }
}
