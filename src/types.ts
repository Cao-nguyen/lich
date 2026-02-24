export type Period = {
  id: string;
  subject: string;
  room?: string;
  note?: string;
  isActive: boolean;
};

export type DaySchedule = {
  id: string;
  name: string; // "Thứ 2", "Thứ 3", etc.
  morning: Period[];
  afternoon: Period[];
};

export type ExtraClass = {
  id: string;
  dayId: string; // Link to day
  time: string;
  subject: string;
  location?: string;
  note?: string;
};

export type Note = {
  id: string;
  content: string;
  createdAt: number;
  color: string;
};

export const DAYS = [
  { id: 'mon', name: 'Thứ 2' },
  { id: 'tue', name: 'Thứ 3' },
  { id: 'wed', name: 'Thứ 4' },
  { id: 'thu', name: 'Thứ 5' },
  { id: 'fri', name: 'Thứ 6' },
  { id: 'sat', name: 'Thứ 7' },
  { id: 'sun', name: 'CN' },
];

export const COLORS = [
  'bg-rose-100 text-rose-900',
  'bg-orange-100 text-orange-900',
  'bg-amber-100 text-amber-900',
  'bg-emerald-100 text-emerald-900',
  'bg-cyan-100 text-cyan-900',
  'bg-blue-100 text-blue-900',
  'bg-violet-100 text-violet-900',
  'bg-fuchsia-100 text-fuchsia-900',
];
