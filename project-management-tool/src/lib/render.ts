export function getColorFromPercentage(percent: number): string {
  const hue = (percent / 100) * 120; // 0 = red, 120 = green
  return `hsl(${hue}, 100%, 50%)`;
}