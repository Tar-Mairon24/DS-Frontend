import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { CaptchaComponent } from '@auth/captcha/captcha.component';
import { MfaComponent } from '@auth/mfa/mfa.component';
import { UserStateService } from '@services/user-state.service';

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
        this.userEmail = response.data.email;
        this.userRole = response.data.role;
        this.userName = response.data.username;
        const mfaEnabled = response.data.mfaEnabled === true;
        this.userStateService.setMfaEnabled(mfaEnabled);
        if (mfaEnabled) {
          this.showMfa = true;
        } else {
          this.completeLogin();
        }
      },
      error: (err) => {
        this.errorMsg = err.error?.error || 'Error al iniciar sesión';
      }
    });
  }

  onMfaClose() {
    this.showMfa = false;
  }

  private completeLogin(): void {
    this.userStateService.setUserName(this.userName);
    this.userStateService.setUserRole(this.userRole);
    this.userStateService.setUserEmail(this.userEmail);
    this.router.navigate(['/dashboard']);
  }

  onMfaVerified(code: string) {
    this.showMfa = false;
    this.userStateService.setMfaVerified(true);
    this.completeLogin();
  }
}
