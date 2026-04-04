import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentAgent } from '../../../appointment.model';

@Component({
  selector: 'app-apt-agents',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './apt-agents.component.html',
  styleUrls: ['./apt-agents.component.css']
})
export class AptAgentsComponent {
  @Input() agents: AppointmentAgent[] = [];

  get assignedAgents(): AppointmentAgent[] {
    // Filter out placeholder empty agents the API sometimes returns
    return this.agents.filter(a => a.username || a.email);
  }

  initials(name: string): string {
    return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase() || '?';
  }
}
