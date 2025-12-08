import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideMenuComponent } from '../side-menu/side-menu.component';
import { UserStateService } from '../services/user-state.service';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [CommonModule, SideMenuComponent],
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.css']
})
export class ConfiguracionComponent implements OnInit {
  userRole: string = '';

  constructor(private userStateService: UserStateService) {}

  ngOnInit() {
    this.userRole = this.userStateService.getUserRole();
  }
}
