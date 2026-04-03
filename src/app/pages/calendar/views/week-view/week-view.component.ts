import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentCalendarView, eventPalette } from '../../appointment.model';

const HOUR_HEIGHT = 64; // px per hour
const START_HOUR  = 7;
const END_HOUR    = 22;
const DAYS_ES     = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
const DAYS_SHORT  = ['DOM','LUN','MAR','MIÉ','JUE','VIE','SÁB'];

export interface WeekDay {
  date: Date;
  label: string;
  num: number;
  isToday: boolean;
  appointments: AppointmentCalendarView[];
}

@Component({
  selector: 'app-week-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './week-view.component.html',
  styleUrls: ['./week-view.component.css']
})
export class WeekViewComponent implements OnChanges {
  @Input() appointments: AppointmentCalendarView[] = [];
  @Input() currentDate = new Date();
  @Output() eventClick = new EventEmitter<number>();

  hours: number[] = [];
  weekDays: WeekDay[] = [];
  today = new Date();

  readonly HOUR_HEIGHT = HOUR_HEIGHT;
  readonly totalHeight = (END_HOUR - START_HOUR) * HOUR_HEIGHT;

  ngOnChanges() {
    this.hours = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => START_HOUR + i);
    this.buildWeek();
  }

  buildWeek() {
    const start = this.weekStart(this.currentDate);
    this.weekDays = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      return {
        date,
        label: DAYS_SHORT[date.getDay()],
        num: date.getDate(),
        isToday: this.isSameDay(date, this.today),
        appointments: this.aptsForDate(date)
      };
    });
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

  getEventColors(apt: AppointmentCalendarView) { return eventPalette(apt); }

  get nowLineTop(): number {
    const now = new Date();
    return ((now.getHours() - START_HOUR) * 60 + now.getMinutes()) * (HOUR_HEIGHT / 60);
  }

  isCurrentWeek(): boolean {
    return this.weekDays.some(d => this.isSameDay(d.date, this.today));
  }

  formatHour(h: number): string {
    return `${h.toString().padStart(2,'0')}:00`;
  }

  formatEventTime(iso: string): string {
    return new Date(iso).toLocaleTimeString('es-MX', { hour:'2-digit', minute:'2-digit', hour12: false });
  }

  private aptsForDate(date: Date): AppointmentCalendarView[] {
    const targetDateStr = this.formatDateToString(date);
    return this.appointments.filter(a => {
      const aptDateStr = a.start_date.split('T')[0];
      return aptDateStr === targetDateStr;
    });
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

  private weekStart(d: Date): Date {
    const s = new Date(d);
    const day = s.getDay();
    s.setDate(s.getDate() - (day === 0 ? 6 : day - 1));
    return s;
  }
}
