import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forbidden',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './forbidden.component.html',
  styleUrls: ['./forbidden.component.css']
})
export class ForbiddenComponent implements OnInit {
  message: string = 'No tienes permiso para acceder a esta página.';
  private router = inject(Router);

  ngOnInit() {
    const state = history.state;
    if (state?.message) {
      this.message = state.message;
    }
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
