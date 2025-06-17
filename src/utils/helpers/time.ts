export function getTimeDiff(dateInput: Date): string {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const date = dateInput;
  date.setHours(0, 0, 0, 0);
  
  if (now.getTime() > date.getTime()) {
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
  
    if (diffSec < 60) return 'beberapa detik lalu';
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin} menit lalu`;
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour} jam lalu`;
    const diffDay = Math.floor(diffHour / 24);
    if (diffDay < 30) return `${diffDay} hari lalu`;
    const diffMonth = Math.floor(diffDay / 30);
    if (diffMonth < 12) return `${diffMonth} bulan lalu`;
    const diffYear = Math.floor(diffMonth / 12);
    return `${diffYear} tahun lalu`;
  } else if (now.getTime() < date.getTime()) {
    const diffMs = date.getTime() - now.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 60) return 'beberapa detik lagi';
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin} menit lagi`;
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour} jam lagi`;
    const diffDay = Math.floor(diffHour / 24);
    if (diffDay < 30) return `${diffDay} hari lagi`;
    const diffMonth = Math.floor(diffDay / 30);
    if (diffMonth < 12) return `${diffMonth} bulan lagi`;
    const diffYear = Math.floor(diffMonth / 12);
    return `${diffYear} tahun lagi`;
  } else return 'sekarang';
}