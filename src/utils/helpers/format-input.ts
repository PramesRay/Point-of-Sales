export const formatNumberInput = (value: string): string => {
  const angka = value.replace(/\D/g, '')
  return angka.replace(/^0+(?=\d)/, '')
}
