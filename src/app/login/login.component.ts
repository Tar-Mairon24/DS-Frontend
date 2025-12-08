import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CaptchaComponent } from '../captcha/captcha.component';
import { MfaComponent } from '../mfa/mfa.component';
import { UserStateService } from '../services/user-state.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CaptchaComponent, MfaComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  submitted = false;
  errorMsg = '';
  captchaToken: string = '';
  showMfa = false;
  userEmail: string = '';
  userRole: string = '';
  userName: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private userStateService: UserStateService
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
      next: (response) => {
        console.log('Login successful:', response);
        this.userEmail = response.email;
        this.userRole = response.role;
        this.userName = response.name;
        this.showMfa = true;
      },
      error: (err) => {
        this.errorMsg = err.error?.error || 'Error al iniciar sesión';
      }
    });
  }

  onMfaClose() {
    this.showMfa = false;
  }

  onMfaVerified(code: string) {
    this.showMfa = false;
    this.userStateService.setUserName(this.userName);
    this.userStateService.setUserRole(this.userRole);
    if (this.userRole === 'admin') {
      this.router.navigate(['/dashboard-admin']);
    } else if (this.userRole === 'agente') {
      this.router.navigate(['/dashboard']);
    }
  }
}
