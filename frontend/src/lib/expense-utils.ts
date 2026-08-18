const splitsMap = {
  '1/2': 0.5,
  '2/3': 2 / 3,
  '2/5': 2 / 5
};

export function applySplit(originalAmount: string, split: string): string {
  const value = parseFloat(originalAmount);
  const fraction = splitsMap[split as keyof typeof splitsMap];
  if (!Number.isFinite(value) || !fraction) return '';
  return (value * fraction).toFixed(2);
}

export function localDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
