import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentCalendarView, eventPalette } from '../../appointment.model';

const HOUR_HEIGHT = 64;
const START_HOUR  = 7;
const END_HOUR    = 22;

@Component({
  selector: 'app-day-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './day-view.component.html',
  styleUrls: ['./day-view.component.css']
})
export class DayViewComponent implements OnChanges {
  @Input() appointments: AppointmentCalendarView[] = [];
  @Input() currentDate = new Date();
  @Output() eventClick = new EventEmitter<number>();

  hours: number[] = [];
  dayAppointments: AppointmentCalendarView[] = [];
  today = new Date();

  readonly HOUR_HEIGHT = HOUR_HEIGHT;
  readonly totalHeight = (END_HOUR - START_HOUR) * HOUR_HEIGHT;

  ngOnChanges() {
    this.hours = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => START_HOUR + i);
    const targetDate = this.formatDateToString(this.currentDate);
    this.dayAppointments = this.appointments.filter(a =>
      a.start_date.split('T')[0] === targetDate
    );
  }

  get isToday(): boolean { return this.isSameDay(this.currentDate, this.today); }

  get nowLineTop(): number {
    const now = new Date();
    return ((now.getHours() - START_HOUR) * 60 + now.getMinutes()) * (HOUR_HEIGHT / 60);
  }

  getEventStyle(apt: AppointmentCalendarView): Record<string, string> {
    const start = new Date(apt.start_date);
    const end   = new Date(apt.end_date);
    const startMin = (start.getHours() - START_HOUR) * 60 + start.getMinutes();
    const endMin   = (end.getHours()   - START_HOUR) * 60 + end.getMinutes();
    const duration = Math.max(endMin - startMin, 30);
    return {
      top:    `${startMin * (HOUR_HEIGHT / 60)}px`,
      height: `${duration * (HOUR_HEIGHT / 60)}px`
    };
  }

  getColors(apt: AppointmentCalendarView) { return eventPalette(apt); }

  formatHour(h: number): string { return `${h.toString().padStart(2,'0')}:00`; }

  formatTime(iso: string): string {
    return new Date(iso).toLocaleTimeString('es-MX', { hour:'2-digit', minute:'2-digit', hour12: false });
  }

  private isSameDay(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear() &&
           a.getMonth()    === b.getMonth()    &&
           a.getDate()     === b.getDate();
  }

  private formatDateToString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
