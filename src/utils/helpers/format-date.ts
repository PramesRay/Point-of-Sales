import { normalizeToDate, type AnyDateLike } from "./time";

// src/helpers/dateHelper.ts
export function formatDate(dateInput: AnyDateLike | null): string {
  if (!dateInput) return '';
  const date = normalizeToDate(dateInput);
  return date!.toLocaleDateString('id-ID', {
    timeZone: 'Asia/Jakarta',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  })
}

export function toISOStringWithWIB(date: Date): string {
  const tzOffsetMinutes = -420; // WIB = UTC+7 = -420 offset
  const local = new Date(date.getTime() - tzOffsetMinutes * 60000);

  const pad = (n: number) => n.toString().padStart(2, '0');

  const year = local.getUTCFullYear();
  const month = pad(local.getUTCMonth() + 1);
  const day = pad(local.getUTCDate());
  const hour = pad(local.getUTCHours());
  const minute = pad(local.getUTCMinutes());
  const second = pad(local.getUTCSeconds());

  return `${year}-${month}-${day}T${hour}:${minute}:${second}+07:00`;
}