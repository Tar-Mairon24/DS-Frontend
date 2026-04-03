import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BaseHttpService } from '@services/http.service';
import { AppointmentCalendarView } from '../pages/calendar/appointment.model';

@Injectable({ providedIn: 'root' })
export class AppointmentService extends BaseHttpService {

  getCalendar(view: 'month' | 'week' | 'day', date: Date): Observable<AppointmentCalendarView[]> {
    const year  = date.getFullYear();
    const month = date.getMonth() + 1;
    const day   = String(date.getDate()).padStart(2, '0');
    const monthStr = String(month).padStart(2, '0');

    let params: string;

    if (view === 'month') {
      // Month view: separate year and month parameters
      params = `view=${view}&year=${year}&month=${month}`;
    } else {
      // Day and week views: date parameter in YYYY-MM-DD format
      const dateStr = `${year}-${monthStr}-${day}`;
      params = `view=${view}&date=${dateStr}`;
    }

    return this.get<{ data: AppointmentCalendarView[] }>(`/appointments/calendar?${params}`)
      .pipe(
        // Keep ISO datetime strings as-is, no normalization needed
        map(r => r.data ?? [])
      );
  }

  private normalizeAppointment(apt: AppointmentCalendarView): AppointmentCalendarView {
    return apt;
  }

  private formatDateForDisplay(dateStr: string): string {
    // No longer needed - keeping full ISO strings
    return dateStr;
  }
}
