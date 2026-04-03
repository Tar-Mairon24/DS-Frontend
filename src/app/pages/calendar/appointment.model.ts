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
  status: 'scheduled' | 'completed' | 'cancelled';
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
  return EVENT_PALETTES[(apt.property?.id ?? apt.id) % EVENT_PALETTES.length];
}
