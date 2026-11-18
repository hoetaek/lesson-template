export function advance(cur: number, elapsed: number, rate: number, total: number): number {
  return Math.min(total, Math.max(0, cur + Math.max(0, elapsed) * rate));
}

export function phase(t: number, start: number, duration: number): number {
  if (duration <= 0) return t >= start ? 1 : 0;
  return Math.min(1, Math.max(0, (t - start) / duration));
}

export function ease(p: number): number {
  return p < 0.5 ? 4 * p ** 3 : 1 - (-2 * p + 2) ** 3 / 2;
}
