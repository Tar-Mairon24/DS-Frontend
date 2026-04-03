import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentCalendarView, DayCell, eventPalette } from '../../appointment.model';

const MONTHS_ES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

@Component({
  selector: 'app-month-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './month-view.component.html',
  styleUrls: ['./month-view.component.css']
})
export class MonthViewComponent implements OnChanges {
  @Input() appointments: AppointmentCalendarView[] = [];
  @Input() currentDate = new Date();
  @Output() eventClick = new EventEmitter<number>();
  @Output() dayClick   = new EventEmitter<Date>();

  readonly DAY_LABELS = ['DOM','LUN','MAR','MIÉ','JUE','VIE','SÁB'];
  grid: DayCell[][] = [];
  today = new Date();

  ngOnChanges() { this.buildGrid(); }

  buildGrid() {
    const year  = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay  = new Date(year, month + 1, 0);

    // Pad to start on Sunday
    const start = new Date(firstDay);
    start.setDate(start.getDate() - start.getDay());

    this.grid = [];
    const cursor = new Date(start);

    for (let week = 0; week < 6; week++) {
      const row: DayCell[] = [];
      for (let d = 0; d < 7; d++) {
        const date = new Date(cursor);
        row.push({
          date,
          isCurrentMonth: date.getMonth() === month,
          isToday: this.isSameDay(date, this.today),
          appointments: this.aptsForDate(date)
        });
        cursor.setDate(cursor.getDate() + 1);
      }
      this.grid.push(row);
      if (cursor > lastDay && cursor.getDay() === 0) break;
    }
  }

  getChipStyle(apt: AppointmentCalendarView) {
    const p = eventPalette(apt);
    return { background: p.bg, 'border-left': `3px solid ${p.border}`, color: p.text };
  }

  onEvent(apt: AppointmentCalendarView, e: MouseEvent) {
    e.stopPropagation();
    this.eventClick.emit(apt.id);
  }

  onDay(cell: DayCell) { this.dayClick.emit(cell.date); }

  private aptsForDate(date: Date): AppointmentCalendarView[] {
    const targetDateStr = this.formatDateToString(date);
    return this.appointments.filter(a => {
      // Extract date from ISO string without timezone conversion
      // "2026-04-03T10:00:00-06:00" → "2026-04-03"
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

  formatTime(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: false });
  }
}
