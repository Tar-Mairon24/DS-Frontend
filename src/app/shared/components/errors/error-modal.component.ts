import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorModalService } from '@services/error-modal.service';

@Component({
  selector: 'app-error-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error-modal.component.html',
  styleUrls: ['./error-modal.component.css']
})
export class ErrorModalComponent {
  readonly modal = inject(ErrorModalService);

  get state() {
    return this.modal.state();
  }

  close(): void {
    this.modal.close();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.state.isOpen) {
      this.close();
    }
  }
}
