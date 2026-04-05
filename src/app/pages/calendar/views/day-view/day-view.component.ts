import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AppointmentCalendarView, eventPalette,
  HOUR_HEIGHT, START_HOUR, END_HOUR,
  isSameDay, aptsForDate, formatHour, formatTime, statusLabel
} from '../../appointment.model';

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
  @Output() eventClick  = new EventEmitter<number>();
  @Output() contextMenu = new EventEmitter<{ apt: AppointmentCalendarView; x: number; y: number }>();

  readonly today = new Date();
  readonly HOUR_HEIGHT = HOUR_HEIGHT;
  readonly totalHeight = (END_HOUR - START_HOUR) * HOUR_HEIGHT;
  hours: number[] = [];
  dayAppointments: AppointmentCalendarView[] = [];

  ngOnChanges() {
    this.hours = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => START_HOUR + i);
    this.dayAppointments = aptsForDate(this.appointments, this.currentDate);
  }

  get isToday(): boolean { return isSameDay(this.currentDate, this.today); }

  get nowLineTop(): number {
    const now = new Date();
    return ((now.getHours() - START_HOUR) * 60 + now.getMinutes()) * (HOUR_HEIGHT / 60);
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

  colors(apt: AppointmentCalendarView) { return eventPalette(apt); }

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
