import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppointmentCalendarView } from '../appointment.model';

export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled' | 'archived' | 'no-show';

export type ContextMenuAction =
  | { type: 'reschedule'; start_date: string; end_date: string }
  | { type: 'edit' }
  | { type: 'status'; status: AppointmentStatus }
  | { type: 'delete' };

interface StatusOption { value: AppointmentStatus; label: string; }

const ALL_STATUSES: StatusOption[] = [
  { value: 'scheduled', label: 'Programada'      },
  { value: 'completed', label: 'Completada'      },
  { value: 'cancelled', label: 'Cancelada'       },
  { value: 'no-show',   label: 'No se presentó' },
  { value: 'archived',  label: 'Archivada'       },
];

@Component({
  selector: 'app-calendar-context-menu',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calendar-context-menu.component.html',
  styleUrls: ['./calendar-context-menu.component.css']
})
export class CalendarContextMenuComponent {
  @Input() apt!: AppointmentCalendarView;
  @Input() x = 0;
  @Input() y = 0;
  @Output() action = new EventEmitter<ContextMenuAction>();
  @Output() close  = new EventEmitter<void>();

  showStatusSubmenu = false;
  showReschedule    = false;

  // Bound to the datetime-local inputs
  newStart = '';
  newEnd   = '';

  /** Hide 'scheduled' if the appointment start time is in the past. */
  get availableStatuses(): StatusOption[] {
    const isPast = new Date(this.apt.start_date) < new Date();
    return isPast ? ALL_STATUSES.filter(s => s.value !== 'scheduled') : ALL_STATUSES;
  }

  /** Pre-fill inputs and switch to reschedule mode. */
  openReschedule(e: MouseEvent) {
    e.stopPropagation();
    this.newStart = this.toLocalInput(this.apt.start_date);
    this.newEnd   = this.toLocalInput(this.apt.end_date);
    this.showReschedule    = true;
    this.showStatusSubmenu = false;
  }

  cancelReschedule(e: MouseEvent) {
    e.stopPropagation();
    this.showReschedule = false;
  }

  confirmReschedule(e: MouseEvent) {
    e.stopPropagation();
    if (!this.newStart || !this.newEnd) return;
    const start = new Date(this.newStart);
    const end   = new Date(this.newEnd);
    if (end <= start) return; // basic validation

    this.action.emit({
      type:       'reschedule',
      start_date: this.toLocalISO(this.newStart),
      end_date:   this.toLocalISO(this.newEnd),
    });
    this.close.emit();
  }

  get rescheduleValid(): boolean {
    if (!this.newStart || !this.newEnd) return false;
    return new Date(this.newEnd) > new Date(this.newStart);
  }

  setStatus(status: AppointmentStatus, e: MouseEvent) {
    e.stopPropagation();
    this.action.emit({ type: 'status', status });
    this.close.emit();
  }

  emit(a: ContextMenuAction, e: MouseEvent) {
    e.stopPropagation();
    this.action.emit(a);
    this.close.emit();
  }

  stopProp(e: MouseEvent) { e.stopPropagation(); }

  @HostListener('document:click')
  @HostListener('document:contextmenu')
  onOutsideClick() { this.close.emit(); }

  /** Convert an ISO string to "YYYY-MM-DDTHH:MM" for datetime-local input (uses local time). */
  private toLocalInput(iso: string): string {
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  private toLocalISO(localStr: string): string {
    const d = new Date(localStr);
    const pad = (n: number) => String(n).padStart(2, '0');
    const offsetMin = -d.getTimezoneOffset();
    const sign      = offsetMin >= 0 ? '+' : '-';
    const absMin    = Math.abs(offsetMin);
    const oh        = pad(Math.floor(absMin / 60));
    const om        = pad(absMin % 60);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
           `T${pad(d.getHours())}:${pad(d.getMinutes())}:00${sign}${oh}:${om}`;
  }
}
