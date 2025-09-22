// time.ts
export type AnyDateLike =
  | Date
  | string
  | number
  | { toDate?: () => Date; seconds?: number; nanoseconds?: number }
  | null
  | undefined;

export function normalizeToDate(input: AnyDateLike): Date | null {
  if (!input) return null;

  // Date asli
  if (input instanceof Date) return isNaN(input.getTime()) ? null : input;

  // number (ms sejak epoch)
  if (typeof input === 'number') {
    const d = new Date(input);
    return isNaN(d.getTime()) ? null : d;
  }

  // string (ISO atau "YYYY-MM-DD HH:mm:ss")
  if (typeof input === 'string') {
    const s = input.includes('T') ? input : input.replace(' ', 'T');
    const d = new Date(s);
    return isNaN(d.getTime()) ? null : d;
  }

  // Firebase Timestamp: .toDate() atau {seconds, nanoseconds}
  if (typeof input.toDate === 'function') {
    const d = input.toDate!();
    return isNaN(d.getTime()) ? null : d;
  }
  if (typeof input.seconds === 'number') {
    const d = new Date(input.seconds * 1000);
    return isNaN(d.getTime()) ? null : d;
  }

  return null;
}

export function getTimeDiff(dateInput: AnyDateLike, append: boolean = true): string {
  const date = normalizeToDate(dateInput);
  if (!date) return ''; // atau '—'

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  if (diffMs === 0) return 'sekarang';

  const past = diffMs > 0;
  const sec = Math.floor(Math.abs(diffMs) / 1000);
  if (sec < 60) return append ? (past ? 'beberapa detik lalu' : 'beberapa detik lagi') : 'beberapa detik';

  const min = Math.floor(sec / 60);
  if (min < 60) return append ? `${min} menit ${past ? 'lalu' : 'lagi'}` : `${min} menit`;

  const hour = Math.floor(min / 60);
  if (hour < 24) return append ? `${hour} jam ${past ? 'lalu' : 'lagi'}` : `${hour} jam`;

  const day = Math.floor(hour / 24);
  if (day < 30) return append ? `${day} hari ${past ? 'lalu' : 'lagi'}` : `${day} hari`;

  const month = Math.floor(day / 30);
  if (month < 12) return append ? `${month} bulan ${past ? 'lalu' : 'lagi'}` : `${month} bulan`;

  const year = Math.floor(month / 12);
  return append ? `${year} tahun ${past ? 'lalu' : 'lagi'}` : `${year} tahun`;
}