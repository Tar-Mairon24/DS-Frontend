import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '@services/user.service';
import { User } from '@shared/models/user';
import { Router } from '@angular/router';
import { SideMenuComponent } from '@shared/layout/side-menu/side-menu.component';
import { ErrorModalService } from '@services/error-modal.service';

@Component({
  selector: 'app-dashboard-users',
  standalone: true,
  imports: [CommonModule, FormsModule, SideMenuComponent],
  templateUrl: './dashboard-users.component.html',
  styleUrls: ['./dashboard-users.component.css']
})
export class DashboardUsersComponent implements OnInit {

  users: User[] = [];

  constructor(
    private userService: UserService,
    private router: Router,
    private errorModal: ErrorModalService,
  ) {}

  ngOnInit() {
    this.loadUsers();
  }
  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (response) => {
        this.users = response || [];
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
      }
    });
  }
  showDeleteModal = false;
  showPasswordModal = false;

  selectedUserId: number | null = null;

  newPassword = '';
  confirmPassword = '';
  passwordError = '';

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
    if (this.selectedUserId !== null) {
      this.userService.deleteUser(this.selectedUserId.toString()).subscribe({
        next: () => {
          console.log('Usuario eliminado correctamente');
          this.loadUsers(); // Reload users after successful deletion
          this.closeDeleteModal();
        },
        error: (err) => {
          console.error('Error al eliminar usuario:', err);
          this.errorModal.showError('Error al eliminar el usuario');
          this.closeDeleteModal();
        }
      });
    }
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.selectedUserId = null;
  }

  // --- Abrir modal cambiar contraseña ---
  openPasswordModal(user: User) {
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
