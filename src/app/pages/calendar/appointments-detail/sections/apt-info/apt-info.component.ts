import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentDetail } from '../../../appointment.model';

@Component({
  selector: 'app-apt-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './apt-info.component.html',
  styleUrls: ['./apt-info.component.css']
})
export class AptInfoComponent {
  @Input() apt!: AppointmentDetail;

  get durationMin(): number {
    return Math.round(
      (new Date(this.apt.end_date).getTime() - new Date(this.apt.start_date).getTime()) / 60000
    );
  }

  get statusLabel(): string {
    const map: Record<string, string> = {
      scheduled: 'Programada', completed: 'Completada', cancelled: 'Cancelada',
      archived: 'Archivada', 'no-show': 'No se presentó'
    };
    return map[this.apt.status] ?? this.apt.status;
  }

  get paddedId(): string { return String(this.apt.id).padStart(5, '0'); }

  formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('es-MX', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
  }

  formatTime(iso: string): string {
    return new Date(iso).toLocaleTimeString('es-MX', {
      hour: '2-digit', minute: '2-digit', hour12: true
    });
  }
}
