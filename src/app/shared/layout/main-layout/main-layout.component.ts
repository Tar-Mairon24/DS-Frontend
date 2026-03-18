import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideMenuComponent } from '@shared/layout/side-menu/side-menu.component';
import { UserStateService } from '@services/user-state.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, SideMenuComponent],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent implements OnInit {
  userRole: string = '';

  constructor(private userStateService: UserStateService) {}

  ngOnInit() {
    this.userRole = this.userStateService.getUserRole();
  }
}
