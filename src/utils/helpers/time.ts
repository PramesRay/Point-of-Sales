export function getTimeDiff(dateInput: Date, append: boolean = true): string {
  if (!dateInput) return '';
  const now = new Date();
  // now.setHours(0, 0, 0, 0);

  const date = dateInput;
  // date.setHours(0, 0, 0, 0);
  
  if (now.getTime() > date.getTime()) {
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
  
    if (diffSec < 60) {
      if (append) return 'beberapa detik lalu';
      return 'beberapa detik';
    }
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) {
      if (append) return `${diffMin} menit lalu`;
      return `${diffMin} menit`;
    }
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) {
      if (append) return `${diffHour} jam lalu`;
      return `${diffHour} jam`;
    }
    const diffDay = Math.floor(diffHour / 24);
    if (diffDay < 30) {
      if (append) return `${diffDay} hari lalu`;
      return `${diffDay} hari`;
    }
    const diffMonth = Math.floor(diffDay / 30);
    if (diffMonth < 12) {
      if (append) return `${diffMonth} bulan lalu`;
      return `${diffMonth} bulan`;
    }
    const diffYear = Math.floor(diffMonth / 12);
    {
      if (append) return `${diffYear} tahun lalu`;
      return `${diffYear} tahun`;
    }
  } else if (now.getTime() < date.getTime()) {
    const diffMs = date.getTime() - now.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 60) {
      if (append) return 'beberapa detik lagi';
      return 'beberapa detik';
    }
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) {
      if (append) return `${diffMin} menit lagi`;
      return `${diffMin} menit`;
    }
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) {
      if (append) return `${diffHour} jam lagi`;
      return `${diffHour} jam`;
    }
    const diffDay = Math.floor(diffHour / 24);
    if (diffDay < 30) {
      if (append) return `${diffDay} hari lagi`;
      return `${diffDay} hari`;
    }
    const diffMonth = Math.floor(diffDay / 30);
    if (diffMonth < 12) {
      if (append) return `${diffMonth} bulan lagi`;
      return `${diffMonth} bulan`;
    }
    const diffYear = Math.floor(diffMonth / 12);
    {
      if (append) return `${diffYear} tahun lagi`;
      return `${diffYear} tahun`;
    }
  } else return 'sekarang';
}