export function getColorFromPercentage(percent: number): string {
  const hue = (percent / 100) * 120; // 0 = red, 120 = green
  return `hsl(${hue}, 100%, 50%)`;
}

export function getColorFromNumber(value: number): string {
  const hue = value % 360; // Wrap value around 0–359 hue degrees
  return `hsl(${hue}, 100%, 50%)`;
}
