import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '@services/user.service';
import { Router } from '@angular/router';
import { MfaComponent } from '@auth/mfa/mfa.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MfaComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  submitted = false;
  errorMsg = '';
  successMsg = '';
  showMfa = false;

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) {
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
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
    return this.registerForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;'./side-menu.component.html'
    if (this.registerForm.invalid) return;

    this.userService.createUser(this.registerForm.value).subscribe({
      next: () => {
        this.successMsg = 'Usuario registrado correctamente';
        this.showMfa = true;
      },
      error: (err) => (this.errorMsg = err.error?.error || 'Error al registrar'),
    });
  }

  onMfaClose() {
    this.showMfa = false;
  }

  onMfaVerified(email: string) {
    console.log('MFA verificado para:', email);
    this.showMfa = false;
    setTimeout(() => this.router.navigate(['/dashboard-admin']), 1500);
  }
}
