import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AppointmentCalendarView, eventPalette,
  DAYS_SHORT, HOUR_HEIGHT, START_HOUR, END_HOUR,
  isSameDay, aptsForDate, formatHour, formatTime, weekStart, statusLabel
} from '../../appointment.model';

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
  @Output() eventClick  = new EventEmitter<number>();
  @Output() dayClick    = new EventEmitter<Date>();
  @Output() contextMenu = new EventEmitter<{ apt: AppointmentCalendarView; x: number; y: number }>();  // clicking a day header

  readonly today = new Date();
  readonly HOUR_HEIGHT = HOUR_HEIGHT;
  readonly totalHeight = (END_HOUR - START_HOUR) * HOUR_HEIGHT;
  hours: number[] = [];
  weekDays: WeekDay[] = [];

  ngOnChanges() {
    this.hours = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => START_HOUR + i);
    this.buildWeek();
  }

  buildWeek() {
    const start = weekStart(this.currentDate);
    this.weekDays = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      return {
        date,
        label: DAYS_SHORT[date.getDay()],
        num: date.getDate(),
        isToday: isSameDay(date, this.today),
        appointments: aptsForDate(this.appointments, date)
      };
    });
  }

  eventStyle(apt: AppointmentCalendarView): Record<string, string> {
    const start = new Date(apt.start_date);
    const end   = new Date(apt.end_date);
    const startMin = (start.getHours() - START_HOUR) * 60 + start.getMinutes();
    const endMin   = (end.getHours()   - START_HOUR) * 60 + end.getMinutes();
    return {
      top:    `${startMin * (HOUR_HEIGHT / 60)}px`,
      height: `${(endMin - startMin) * (HOUR_HEIGHT / 60)}px`
    };
  }

  eventColors(apt: AppointmentCalendarView) { return eventPalette(apt); }

  get nowLineTop(): number {
    const now = new Date();
    return ((now.getHours() - START_HOUR) * 60 + now.getMinutes()) * (HOUR_HEIGHT / 60);
  }

  isCurrentWeek(): boolean {
    return this.weekDays.some(d => isSameDay(d.date, this.today));
  }

  onContextMenu(apt: AppointmentCalendarView, e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    this.contextMenu.emit({ apt, x: e.clientX, y: e.clientY });
  }


  // ── Long press (mobile context menu) ─────────────────────────────────────

  private longPressTimer: any = null;

  onTouchStart(apt: AppointmentCalendarView, e: TouchEvent) {
    this.longPressTimer = setTimeout(() => {
      const touch = e.touches[0];
      this.contextMenu.emit({ apt, x: touch.clientX, y: touch.clientY });
    }, 450);
  }

  onTouchEnd() {
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }
  }

  onTouchMove() {
    // Cancel if the user scrolls
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }
  }

  formatHour   = formatHour;
  formatTime   = formatTime;
  statusLabel  = statusLabel;
}
