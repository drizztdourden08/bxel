/* @layer core @kind logic */
import type { Sweep } from './selection.type';

const slideLine = (source: Uint8Array, sweep: Sweep, line: number, radius: number): Uint16Array => {
  const { length, step } = sweep;
  const start = line * sweep.lineStep;
  const lit = (k: number): number => ((source[start + k * step] ?? 0) === 0 ? 0 : 1);
  const counts = new Uint16Array(length);
  let sum = 0;
  for (let k = 0; k <= radius && k < length; k++) {
    sum += lit(k);
  }
  for (let k = 0; k < length; k++) {
    counts[k] = sum;
    sum += k + radius + 1 < length ? lit(k + radius + 1) : 0;
    sum -= k - radius >= 0 ? lit(k - radius) : 0;
  }
  return counts;
};

const slideWindow = (source: Uint8Array, sweep: Sweep, radius: number): Uint16Array => {
  const counts = new Uint16Array(source.length);
  for (let line = 0; line < sweep.lines; line++) {
    const start = line * sweep.lineStep;
    for (const [k, count] of slideLine(source, sweep, line, radius).entries()) {
      counts[start + k * sweep.step] = count;
    }
  }
  return counts;
};

export { slideWindow };
