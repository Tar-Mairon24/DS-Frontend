import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentDetail } from '../../../appointment.model';

@Component({
  selector: 'app-apt-people',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './apt-people.component.html',
  styleUrls: ['./apt-people.component.css']
})
export class AptPeopleComponent {
  @Input() apt!: AppointmentDetail;

  initials(name: string): string {
    return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
  }
}
