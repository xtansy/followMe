export function convertPriceToNumber(price: {
  units: number;
  nanos: number;
}): number {
  const nanosPart = price.nanos / 1e9;
  return price.units + nanosPart;
}

export function convertNumberToPrice(num: number): {
  units: number;
  nanos: number;
} {
  const units = Math.floor(num);
  const nanos = Math.round((num - units) * 1e9);
  return { units, nanos };
}
