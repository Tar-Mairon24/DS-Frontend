import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideMenuComponent } from '../side-menu/side-menu.component';
import { UserStateService } from '../services/user-state.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, SideMenuComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  userName: string = '';
  userRole: string = '';

  constructor(private userStateService: UserStateService) {}

  ngOnInit() {
    this.userName = this.userStateService.getUserName();
    this.userRole = this.userStateService.getUserRole();
  }
}
