export const formatRupiah = (angka: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(angka);
};

export const formatRupiahInput = (value: string | number): string => {
  let angka = typeof value === 'number' ? value.toString() : value.replace(/\D/g, '')

  // Hapus nol di depan angka (kecuali 0 sendiri)
  angka = angka.replace(/^0+(?=\d)/, '')

  return angka.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}


export const shortenNumber = (num: number) => {
  if (num >= 1_000_000_000) return { value: (num / 1_000_000_000).toFixed(1), suffix: 'M' };
  if (num >= 1_000_000) return { value: (num / 1_000_000).toFixed(1), suffix: 'jt' };
  if (num >= 1_000) return { value: (num / 1_000).toFixed(1), suffix: 'rb' };
  return { value: num.toString(), suffix: '' };
};