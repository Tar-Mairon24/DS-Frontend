import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.css']
})
export class EmptyStateComponent {
  @Input() title: string = 'Oops — no pudimos encontrar elementos';
  @Input() subtitle: string = 'Intenta refrescar la página o contactar al administrador.';
  @Input() actionLabel: string = '';

  @Output() retry = new EventEmitter<void>();
  @Output() action = new EventEmitter<void>();
}
