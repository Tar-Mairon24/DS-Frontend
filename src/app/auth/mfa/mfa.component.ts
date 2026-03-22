import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MfaService } from '@services/mfa.service';

@Component({
  selector: 'app-mfa',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mfa.component.html',
  styleUrls: ['./mfa.component.css']
})
export class MfaComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() verified = new EventEmitter<string>();
  @Input() propsEmail: string = '';
  @Input() propsReason: string = '';

  code = "";
  resendCount = 0;
  private verifyTimeout: any;
  sentCode = false;

  constructor(private mfaService: MfaService) {}

  ngOnInit() {
    console.log("Enviando código MFA al abrir modal...");
    this.sendInitialCode();
  }

  sendInitialCode() {
    this.mfaService.sendMfaCode({email: this.propsEmail, reason: this.propsReason}).subscribe({
      next: (response) => {
        console.log("Código MFA enviado:", response);
        this.sentCode = true;
      },
      error: (err) => {
        console.error("Error al enviar código MFA:", err);
        alert("Error al enviar el código. Por favor intenta nuevamente.");
      }
    });
  }

  onCodeInput(event: any) {
    this.code = event.target.value;

    if (this.verifyTimeout) {
      clearTimeout(this.verifyTimeout);
    }

    if (this.code.length === 6) {
      this.verifyTimeout = setTimeout(() => {
        this.verifyCode();
      }, 300);
    }
  }

  verifyCode() {
    if (this.code.length === 6) {
      const credentials = { email: this.propsEmail, code: this.code };

      this.mfaService.verifyMfa(credentials).subscribe({
        next: (response) => {
          console.log("Respuesta de verificación MFA:", response);
          this.handleSuccessfulVerification();
        },
        error: (err) => {
          console.error("Error al verificar MFA:", err);
          alert("Código incorrecto. Intenta nuevamente.");
          this.code = "";
        }
      });
    }
  }

  handleSuccessfulVerification() {
    console.log("MFA verificado exitosamente.");
    alert("Verificación exitosa. Redirigiendo...");
    this.verified.emit(this.code);
    this.closeModal();
  }

  resendCode() {
    console.log("Reenviando código MFA...");
    this.mfaService.resendMfaCode(this.propsEmail).subscribe({
      next: (response) => {
        console.log("Código MFA reenviado:", response);
        this.handleResendResponse();
      },
      error: (err) => {
        console.error("Error al reenviar código MFA:", err);
        alert("Error al reenviar el código. Intenta nuevamente más tarde.");
      }
    });
  }

  handleResendResponse() {
    this.resendCount++;
    if (this.resendCount > 3) {
      alert("Has excedido el número máximo de reenvíos.");
      this.closeModal();
    } else if (this.resendCount === 3) {
      alert("Último intento de reenvío.");
    } else {
      alert("Código reenviado. Revisa tu correo.");
    }
  }

  closeModal() {
    this.sentCode = false;
    this.close.emit();
  }

  ngOnDestroy() {
    if (this.verifyTimeout) {
      clearTimeout(this.verifyTimeout);
    }
  }
}
