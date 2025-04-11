export const formatRupiah = (angka: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(angka);
};

export const shortenNumber = (num: number) => {
  if (num >= 1_000_000_000) return { value: (num / 1_000_000_000).toFixed(1), suffix: 'M' };
  if (num >= 1_000_000) return { value: (num / 1_000_000).toFixed(1), suffix: 'jt' };
  if (num >= 1_000) return { value: (num / 1_000).toFixed(1), suffix: 'rb' };
  return { value: num.toString(), suffix: '' };
};