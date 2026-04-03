import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AppointmentCalendarView, DayCell, eventPalette,
  isSameDay, toDateStr, aptsForDate, formatTime
} from '../../appointment.model';

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
  readonly today = new Date();
  grid: DayCell[][] = [];

  ngOnChanges() { this.buildGrid(); }

  buildGrid() {
    const year  = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay  = new Date(year, month + 1, 0);

    // Pad grid to start on Sunday
    const cursor = new Date(firstDay);
    cursor.setDate(cursor.getDate() - cursor.getDay());

    this.grid = [];
    while (true) {
      const row: DayCell[] = [];
      for (let d = 0; d < 7; d++) {
        const date = new Date(cursor);
        row.push({
          date,
          isCurrentMonth: date.getMonth() === month,
          isToday: isSameDay(date, this.today),
          appointments: aptsForDate(this.appointments, date)
        });
        cursor.setDate(cursor.getDate() + 1);
      }
      this.grid.push(row);
      if (cursor > lastDay && cursor.getDay() === 0) break;
    }
  }

  chipStyle(apt: AppointmentCalendarView) {
    const p = eventPalette(apt);
    return { background: p.bg, 'border-left': `3px solid ${p.border}`, color: p.text };
  }

  onEvent(apt: AppointmentCalendarView, e: MouseEvent) {
    e.stopPropagation();
    this.eventClick.emit(apt.id);
  }

  formatTime = formatTime;
}
