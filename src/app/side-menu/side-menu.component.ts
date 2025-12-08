import { Component, Input, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserStateService } from '../services/user-state.service';

@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css']
})
export class SideMenuComponent {

  constructor(
    private router: Router,
    @Inject(UserStateService) private userStateService: UserStateService
  ) {}

  @Input() propsRole: string = '';

  logout() {
    this.userStateService.clearUserData();
    this.router.navigate(['/login']);
  }
}
