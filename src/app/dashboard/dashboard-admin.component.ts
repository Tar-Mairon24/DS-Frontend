import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, UserDTO } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css']
})
export class DashboardAdminComponent implements OnInit {

  users: UserDTO[] = [];

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    this.loadUsers();
  }
  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
      }
    });
  }
  // Estado de modales
  showDeleteModal = false;
  showPasswordModal = false;

  selectedUserId: number | null = null;

  newPassword = '';
  confirmPassword = '';
  passwordError = '';

  // ✔️ Validaciones dinámicas de la contraseña
  get passHasMinLength() {
    return this.newPassword.length >= 8;
  }

  get passHasUppercase() {
    return /[A-Z]/.test(this.newPassword);
  }

  get passHasDigit() {
    return /[0-9]/.test(this.newPassword);
  }

  // --- Abrir modal eliminar ---
  openDeleteModal(id: number) {
    this.selectedUserId = id;
    this.showDeleteModal = true;
  }

  confirmDelete() {
    this.users = this.users.filter(u => u.id !== this.selectedUserId);
    this.showDeleteModal = false;
    this.selectedUserId = null;
  }

  // --- Abrir modal cambiar contraseña ---
  openPasswordModal(user: UserDTO) {
    this.selectedUserId = user.id;
    this.newPassword = '';
    this.confirmPassword = '';
    this.passwordError = '';
    this.showPasswordModal = true;
  }

  // --- Guardar nueva contraseña con validaciones ---
  saveNewPassword() {

    if (this.newPassword.trim() === '' || this.confirmPassword.trim() === '') {
      this.passwordError = 'Los campos no pueden estar vacíos.';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.passwordError = 'Las contraseñas no coinciden.';
      return;
    }

    if (!this.passHasMinLength) {
      this.passwordError = 'La contraseña debe tener al menos 8 caracteres.';
      return;
    }

    if (!this.passHasUppercase) {
      this.passwordError = 'Debe contener al menos una letra mayúscula.';
      return;
    }

    if (!this.passHasDigit) {
      this.passwordError = 'Debe contener al menos un número.';
      return;
    }

    // ✔️ Si todo está correcto, guardar la contraseña
    const user = this.users.find(u => u.id === this.selectedUserId);
    if (user) user.password = this.newPassword;

    // Cerrar modal
    this.showPasswordModal = false;
    this.selectedUserId = null;
  }

  createUser() {
    this.router.navigate(['/register']);
  }
}
