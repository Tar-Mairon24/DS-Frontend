import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CaptchaComponent } from '../captcha/captcha.component';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, CaptchaComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  submitted = false;
  errorMsg = '';
  captchaToken: string = '';

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

    // payload final incluyendo el captcha
    const payload = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
      captcha: this.captchaToken
    };

    this.authService.login(payload).subscribe({
    next: () => this.router.navigate(['/mfa']),
    error: (err) => {
      this.errorMsg = err.error?.error || 'Error al iniciar sesión';
    }
  });
  }
}
