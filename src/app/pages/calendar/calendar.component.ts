import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { AppointmentService } from '../../services/appointment.service';
import {
  AppointmentCalendarView, MONTHS_ES, DAYS_ES, DAYS_SHORT,
  toDateStr, parseDateStr, weekStart, isSameDay
} from './appointment.model';
import { MonthViewComponent } from './views/month-view/month-view.component';
import { WeekViewComponent } from './views/week-view/week-view.component';
import { DayViewComponent } from './views/day-view/day-view.component';

type CalView = 'month' | 'week';

const MOBILE_BP = 768;

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, MonthViewComponent, WeekViewComponent, DayViewComponent],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit, OnDestroy {
  view: CalView = 'month';
  currentDate = new Date();
  panelDay: Date | null = null;
  appointments: AppointmentCalendarView[] = [];
  isLoading = false;

  // ── Picker state ──────────────────────────────────────────────────────────
  showPicker     = false;
  pickerYear     = new Date().getFullYear();
  pickerMonth    = new Date().getMonth();
  pickerWeekItems: { anchor: Date; label: string }[] = [];

  // ── Mobile state ──────────────────────────────────────────────────────────
  isMobile = window.innerWidth < MOBILE_BP;
  mobileWeekDays: Date[] = [];

  readonly MONTHS_ES = MONTHS_ES;
  readonly DAYS_SHORT = DAYS_SHORT;

  constructor(
    private svc: AppointmentService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  @HostListener('window:resize')
  onResize() {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth < MOBILE_BP;
    if (!wasMobile && this.isMobile) this.initMobile();
    if (wasMobile && !this.isMobile)  this.panelDay = null;
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.loadFromParams(params);
      if (!params['view'] || !params['date']) { this.updateUrl(); return; }
      this.fetch();
      if (this.isMobile) this.initMobile();
    });
  }

  ngOnDestroy() {}

  // ── Computed labels ───────────────────────────────────────────────────────

  get headerLabel(): string {
    if (this.isMobile && this.panelDay) {
      const d = this.panelDay;
      return `${MONTHS_ES[d.getMonth()]} ${d.getFullYear()}`;
    }
    const m = MONTHS_ES[this.currentDate.getMonth()];
    const y = this.currentDate.getFullYear();
    if (this.view === 'month') return `${m} ${y}`;
    const start = weekStart(this.currentDate);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    return `${start.getDate()} – ${end.getDate()} ${MONTHS_ES[end.getMonth()]} ${y}`;
  }

  get panelDayLabel(): string {
    if (!this.panelDay) return '';
    const d = this.panelDay;
    return `${DAYS_ES[d.getDay()]}, ${d.getDate()} de ${MONTHS_ES[d.getMonth()]} ${d.getFullYear()}`;
  }

  // ── Weeks for picker ─────────────────────────────────────────────────────

  buildPickerWeeks(): void {
    const MO = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    const result: { anchor: Date; label: string }[] = [];
    const lastOfMonth = new Date(this.pickerYear, this.pickerMonth + 1, 0); // last day
    let mon = weekStart(new Date(this.pickerYear, this.pickerMonth, 1));

    while (mon <= lastOfMonth) {
      const sun = new Date(mon);
      sun.setDate(mon.getDate() + 6);

      const sm = MO[mon.getMonth()];
      const em = MO[sun.getMonth()];
      const label = mon.getMonth() === sun.getMonth()
        ? mon.getDate() + ' - ' + sun.getDate() + ' ' + em
        : mon.getDate() + ' ' + sm + ' - ' + sun.getDate() + ' ' + em;

      // anchor: if Monday is in a previous month, anchor to 1st of target month
      const anchor = mon.getMonth() === this.pickerMonth
        ? new Date(mon)
        : new Date(this.pickerYear, this.pickerMonth, 1);

      result.push({ anchor, label });
      mon = new Date(mon);
      mon.setDate(mon.getDate() + 7);
    }
    this.pickerWeekItems = result;
  }

  isPickerWeekActive(anchor: Date): boolean {
    return isSameDay(weekStart(anchor), weekStart(this.currentDate));
  }

  // ── Main view navigation ──────────────────────────────────────────────────

  navigate(dir: -1 | 1) {
    if (this.isMobile) {
      // On mobile, arrows step days
      this.navigatePanel(dir);
      return;
    }
    const d = new Date(this.currentDate);
    if (this.view === 'month') d.setMonth(d.getMonth() + dir);
    else                       d.setDate(d.getDate() + dir * 7);
    this.currentDate = d;
    this.updateUrl();
  }

  goToday() {
    this.currentDate = new Date();
    if (this.isMobile || this.panelDay !== null) this.panelDay = new Date();
    this.buildMobileWeek();
    this.updateUrl();
    this.showPicker = false;
  }

  setView(v: CalView) {
    this.view = v;
    this.panelDay = null;
    this.updateUrl();
    this.showPicker = false;
  }

  goBack() {
    const currentUrl = this.router.url;
    this.location.back();
    setTimeout(() => {
      if (this.router.url === currentUrl) this.router.navigate(['/dashboard']);
    }, 300);
  }

  // ── Picker ────────────────────────────────────────────────────────────────

  togglePicker() {
    this.showPicker = !this.showPicker;
    if (this.showPicker) {
      this.pickerYear  = this.currentDate.getFullYear();
      this.pickerMonth = this.currentDate.getMonth();
      this.buildPickerWeeks();
    }
  }

  closePicker() { this.showPicker = false; }

  pickerSelectMonth(monthIndex: number) {
    this.pickerMonth = monthIndex;
    this.buildPickerWeeks(); // rebuild week list for this month

    if (this.view === 'month' || this.isMobile) {
      this.currentDate = new Date(this.pickerYear, monthIndex, 1);
      if (this.isMobile) {
        this.panelDay = new Date(this.pickerYear, monthIndex, 1);
        this.buildMobileWeek();
        this.showPicker = false;
      }
      this.updateUrl();
    }
    // In week view: just update the week list, wait for user to pick a week
  }

  pickerSelectWeek(anchor: Date) {
    this.currentDate = new Date(anchor);
    this.updateUrl();
    this.showPicker = false;
  }

  isPickerMonthActive(monthIndex: number): boolean {
    return this.pickerMonth === monthIndex;
  }

  // ── Day panel navigation ──────────────────────────────────────────────────

  navigatePanel(dir: -1 | 1) {
    const base = this.panelDay ?? new Date();
    const newDay = new Date(base);
    newDay.setDate(newDay.getDate() + dir);
    this.panelDay = newDay;
    this.buildMobileWeek();

    if (!this.isDayInCurrentPeriod(newDay)) {
      this.currentDate = new Date(newDay);
      this.updateUrl();
    } else {
      this.fetch();
    }
  }

  openPanel(date: Date) {
    this.panelDay = date;
    this.buildMobileWeek();
  }

  closePanel() {
    if (!this.isMobile) this.panelDay = null;
  }

  onDayClick(date: Date)   { this.openPanel(date); }
  onEventClick(id: number) { console.log('open appointment:', id); }

  // ── Mobile week strip ─────────────────────────────────────────────────────

  initMobile() {
    if (!this.panelDay) this.panelDay = new Date();
    this.buildMobileWeek();
  }

  buildMobileWeek() {
    const anchor = this.panelDay ?? this.currentDate;
    const monday = weekStart(anchor);
    this.mobileWeekDays = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    });
  }

  selectMobileDay(date: Date) {
    this.panelDay = date;
    if (!this.isDayInCurrentPeriod(date)) {
      this.currentDate = new Date(date);
      this.updateUrl();
    } else {
      this.fetch();
    }
  }

  isMobileSelectedDay(date: Date): boolean {
    return this.panelDay !== null && isSameDay(date, this.panelDay);
  }

  isMobileToday(date: Date): boolean {
    return isSameDay(date, new Date());
  }

  // ── Data ─────────────────────────────────────────────────────────────────

  fetch() {
    this.isLoading = true;
    this.svc.getCalendar(this.view, this.currentDate).subscribe({
      next: d  => { this.appointments = d; this.isLoading = false; },
      error: () => { this.appointments = []; this.isLoading = false; }
    });
  }

  // ── Private ───────────────────────────────────────────────────────────────

  private loadFromParams(params: any) {
    this.view = (['month', 'week'] as CalView[]).includes(params['view'])
      ? (params['view'] as CalView)
      : 'month';
    this.currentDate = params['date']
      ? (parseDateStr(params['date']) ?? new Date())
      : new Date();
  }

  private updateUrl() {
    this.router.navigate(['/calendar'], {
      queryParams: { view: this.view, date: toDateStr(this.currentDate) },
      replaceUrl: true
    });
  }

  private isDayInCurrentPeriod(day: Date): boolean {
    if (this.view === 'month') {
      return day.getFullYear() === this.currentDate.getFullYear()
          && day.getMonth()    === this.currentDate.getMonth();
    }
    const start = weekStart(this.currentDate);
    const end   = new Date(start);
    end.setDate(end.getDate() + 6);
    return day >= start && day <= end;
  }
}
