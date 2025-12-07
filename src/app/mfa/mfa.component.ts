import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mfa',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mfa.component.html',
  styleUrls: ['./mfa.component.css']
})
export class MfaComponent {
  @Output() close = new EventEmitter<void>();
  @Output() verified = new EventEmitter<string>();

  code = "";

  constructor(private router: Router) {}

  onCodeInput(event: any) {
    this.code = event.target.value;
  }

  verifyCode() {
    if (this.code.length === 6) {
      console.log("Código ingresado:", this.code);
      this.verified.emit(this.code);
      this.router.navigate(['/dashboard-admin']);
    }
  }

  resendCode() {
    console.log("Reenviando código MFA...");
    alert("Se ha reenviado el código MFA a tu correo electrónico.");
  }

  closeModal() {
    this.close.emit();
  }
}
