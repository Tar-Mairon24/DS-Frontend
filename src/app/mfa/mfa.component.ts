import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mfa',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mfa.component.html',
  styleUrls: ['./mfa.component.css']
})
export class MfaComponent {

  boxes = Array(6).fill(0);
  code = ""; 

  constructor(private router: Router) {}

  onCodeInput(event: any) {
    this.code = event.target.value;
  }

  verifyCode() {
    console.log("Código ingresado:", this.code);

    // Más adelante esto llamará a tu backend
    // Por ahora solo redirigimos a Welcome
    this.router.navigate(['/welcome']);
  }
}
