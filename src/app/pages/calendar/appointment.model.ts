// ── Models ──────────────────────────────────────────────────────────────────

export interface AppointmentProperty {
  id: number;
  title: string;
  description: string | null;
}

export interface AppointmentCalendarView {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'archived' | 'no-show';
  property: AppointmentProperty;
  client_id: number;
  owner_id: number;
}

export interface DayCell {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  appointments: AppointmentCalendarView[];
}

// ── Constants ────────────────────────────────────────────────────────────────

export const MONTHS_ES = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'
];
export const DAYS_ES    = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
export const DAYS_SHORT = ['DOM','LUN','MAR','MIÉ','JUE','VIE','SÁB'];

export const HOUR_HEIGHT = 64; // px per hour
export const START_HOUR  = 7;
export const END_HOUR    = 22;

// ── Event palettes ───────────────────────────────────────────────────────────

export const EVENT_PALETTES = [
  { bg: '#dbeafe', border: '#3b82f6', text: '#1d4ed8' },
  { bg: '#dcfce7', border: '#22c55e', text: '#15803d' },
  { bg: '#fce7f3', border: '#ec4899', text: '#9d174d' },
  { bg: '#fef3c7', border: '#f59e0b', text: '#92400e' },
  { bg: '#ede9fe', border: '#8b5cf6', text: '#5b21b6' },
  { bg: '#ffedd5', border: '#f97316', text: '#c2410c' },
];

export function eventPalette(apt: AppointmentCalendarView): (typeof EVENT_PALETTES)[0] {
  if (apt.status === 'cancelled') return { bg: '#fee2e2', border: '#ef4444', text: '#b91c1c' };
  if (apt.status === 'completed') return { bg: '#dcfce7', border: '#22c55e', text: '#15803d' };
  if (apt.status === 'archived')  return { bg: '#f3f4f6', border: '#9ca3af', text: '#6b7280' };
  if (apt.status === 'no-show')   return { bg: '#fef3c7', border: '#f59e0b', text: '#92400e' };
  return EVENT_PALETTES[(apt.property?.id ?? apt.id) % EVENT_PALETTES.length];
}

// ── Shared utilities (used across all view components) ───────────────────────

/** True when two Dates fall on the same calendar day. */
export function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear()
      && a.getMonth()    === b.getMonth()
      && a.getDate()     === b.getDate();
}

/** Format a Date as "YYYY-MM-DD" without timezone conversion. */
export function toDateStr(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Parse a "YYYY-MM-DD" string into a local Date, or null on failure. */
export function parseDateStr(s: string): Date | null {
  const match = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  const date = new Date(+match[1], +match[2] - 1, +match[3]);
  return isNaN(date.getTime()) ? null : date;
}

/** Format an hour number as "HH:00". */
export function formatHour(h: number): string {
  return `${h.toString().padStart(2, '0')}:00`;
}

/** Format an ISO datetime string as "HH:MM" (24h, es-MX locale). */
export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('es-MX', {
    hour: '2-digit', minute: '2-digit', hour12: false
  });
}

/** Return the Monday that starts the week containing d. */
export function weekStart(d: Date): Date {
  const s = new Date(d);
  const day = s.getDay();
  s.setDate(s.getDate() - (day === 0 ? 6 : day - 1));
  return s;
}

/** Filter appointments whose start_date falls on date. */
export function aptsForDate(
  appointments: AppointmentCalendarView[],
  date: Date
): AppointmentCalendarView[] {
  const target = toDateStr(date);
  return appointments.filter(a => a.start_date.split('T')[0] === target);
}

// ── Appointment Detail (single appointment endpoint) ─────────────────────────

export interface AppointmentAgent {
  id: number;
  username: string;
  email: string;
}

export interface AppointmentDetail {
  id: number;
  title: string;
  description: string;
  notes: string | null;
  start_date: string;
  end_date: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'archived' | 'no-show';
  property_id: number;
  property_title: string;
  property_address: string;
  client_id: number;
  client_name: string;
  client_email: string;
  client_phone: string;
  owner_id: number;
  owner_name: string;
  owner_email: string;
  owner_phone: string;
  agents: AppointmentAgent[];
}

/** Translate appointment status value to Spanish label. */
export function statusLabel(status: string): string {
  const map: Record<string, string> = {
    'scheduled': 'Programada',
    'completed': 'Completada',
    'cancelled': 'Cancelada',
    'archived':  'Archivada',
    'no-show':   'No se presentó',
  };
  return map[status] ?? status;
}
