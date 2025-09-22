export function getSuggestedTotalCash(total: number): number[] {
  const denominations = [1000, 2000, 5000, 10000, 20000, 50000, 100000];
  const suggestions = new Set<number>();
  suggestions.add(total);

  let last = total;

  for (const denom of denominations) {
    const next = Math.ceil(last / denom) * denom;
    if (next > last) {
      suggestions.add(next);
      last = next; // ⛔ jangan terus naik dari total, tapi dari yang terakhir logis
    }

    if (denom >= total) {
      break;
    }
  }

  return Array.from(suggestions).sort((a, b) => a - b);
}