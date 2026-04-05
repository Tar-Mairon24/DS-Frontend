import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BaseHttpService } from '@services/http.service';
import { AppointmentCalendarView } from '../pages/calendar/appointment.model';
import { AppointmentDetail } from '@calendar/appointment.model';

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

  getById(id: number): Observable<AppointmentDetail> {
    return this.get<{ data: AppointmentDetail }>(`/appointments/${id}`)
      .pipe(map(r => r.data));
  }

  update(id: number, data: Partial<AppointmentDetail>): Observable<any> {
    return this.put(`/appointments/${id}`, data);
  }

  // PATCH /appointments/:id/status
  updateStatus(id: number, status: 'scheduled' | 'completed' | 'cancelled' | 'archived' | 'no-show'): Observable<any> {
    return this.patch(`/appointments/${id}/status`, { status });
  }

  // PATCH /appointments/:id/reschedule
  reschedule(id: number, start_date: string, end_date: string): Observable<any> {
    return this.patch(`/appointments/${id}/reschedule`, { start_date, end_date });
  }
 

  // DELETE /appointments/:id
  deleteAppointment(id: number): Observable<any> {
    return this.delete(`/appointments/${id}`);
  }
}
