import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { AppointmentService } from '../../services/appointment.service';
import { AppointmentCalendarView } from './appointment.model';
import { MonthViewComponent } from './views/month-view/month-view.component';
import { WeekViewComponent } from './views/week-view/week-view.component';
import { DayViewComponent } from './views/day-view/day-view.component';

type CalView = 'month' | 'week' | 'day';

const MONTHS_ES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const DAYS_ES = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, MonthViewComponent, WeekViewComponent, DayViewComponent],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  view: CalView = 'month';
  currentDate = new Date();
  appointments: AppointmentCalendarView[] = [];
  isLoading = false;

  constructor(
    private svc: AppointmentService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit() {
    // Subscribe to query params changes - URL is the source of truth
    this.route.queryParams.subscribe(params => {
      this.loadStateFromParams(params);
      this.fetch();
    });
  }

  private loadStateFromParams(params: any) {
    // Read view from URL, default to 'month'
    if (params['view'] && ['month', 'week', 'day'].includes(params['view'])) {
      this.view = params['view'] as CalView;
    } else {
      this.view = 'month';
    }

    // Read date from URL, default to today
    if (params['date']) {
      const parsedDate = this.parseDateFromString(params['date']);
      if (parsedDate) {
        this.currentDate = parsedDate;
      } else {
        this.currentDate = new Date();
      }
    } else {
      this.currentDate = new Date();
    }
  }

  goBack() {
    const currentUrl = this.router.url;
    this.location.back();

    setTimeout(() => {
      if (this.router.url === currentUrl) {
        this.router.navigate(['/dashboard']);
      }
    }, 300);
  }

  get headerLabel(): string {
    const m = MONTHS_ES[this.currentDate.getMonth()];
    const y = this.currentDate.getFullYear();
    if (this.view === 'month') return `${m} ${y}`;
    if (this.view === 'day') {
      return `${DAYS_ES[this.currentDate.getDay()]}, ${this.currentDate.getDate()} de ${m} ${y}`;
    }
    const start = this.weekStart(this.currentDate);
    const end = new Date(start); end.setDate(end.getDate() + 6);
    return `${start.getDate()} – ${end.getDate()} ${MONTHS_ES[end.getMonth()]} ${y}`;
  }

  navigate(dir: -1 | 1) {
    const d = new Date(this.currentDate);
    if (this.view === 'month')     d.setMonth(d.getMonth() + dir);
    else if (this.view === 'week') d.setDate(d.getDate() + dir * 7);
    else                           d.setDate(d.getDate() + dir);
    this.currentDate = d;
    this.updateUrl();
  }

  goToday() {
    this.currentDate = new Date();
    this.updateUrl();
  }

  setView(v: CalView) {
    this.view = v;
    this.updateUrl();
  }

  onEventClick(id: number) { console.log('open appointment:', id); }

  onDayClick(date: Date) {
    this.currentDate = date;
    this.setView('day');
  }

  private updateUrl() {
    const dateStr = this.formatDateToString(this.currentDate);
    this.router.navigate(
      ['/calendar'],
      {
        queryParams: {
          view: this.view,
          date: dateStr
        },
        replaceUrl: true
      }
    );
  }

  private formatDateToString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private parseDateFromString(dateStr: string): Date | null {
    const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) return null;
    const date = new Date(parseInt(match[1]), parseInt(match[2]) - 1, parseInt(match[3]));
    return isNaN(date.getTime()) ? null : date;
  }

  fetch() {
    this.isLoading = true;
    this.svc.getCalendar(this.view, this.currentDate).subscribe({
      next: d  => { this.appointments = d; this.isLoading = false; },
      error: () => { this.appointments = []; this.isLoading = false; }
    });
  }

  private weekStart(d: Date): Date {
    const s = new Date(d);
    const day = s.getDay();
    s.setDate(s.getDate() - (day === 0 ? 6 : day - 1));
    return s;
  }
}
