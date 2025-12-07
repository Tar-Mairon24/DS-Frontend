import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CaptchaComponent } from '../captcha/captcha.component';
import { MfaComponent } from '../mfa/mfa.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, CaptchaComponent, MfaComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  submitted = false;
  errorMsg = '';
  captchaToken: string = '';
  showMfa = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern('^(?=.*[a-z])(?=.*[A-Z]).+$'),
        ],
      ],
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onToken(token: string) {
    this.captchaToken = token;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.loginForm.invalid || !this.captchaToken) {
      this.errorMsg = "Completa los campos y resuelve el CAPTCHA.";
      return;
    }

    const payload = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
      captcha: this.captchaToken
    };

    this.authService.login(payload).subscribe({
      next: () => {
        this.showMfa = true; // Show MFA modal instead of navigating
      },
      error: (err) => {
        this.errorMsg = err.error?.error || 'Error al iniciar sesión';
      }
    });
  }

  onMfaVerified(code: string) {
    console.log('MFA verified with code:', code);
    this.showMfa = false;
    // You can add MFA verification logic here if needed
  }

  onMfaClose() {
    this.showMfa = false;
  }
}
