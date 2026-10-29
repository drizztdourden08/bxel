/* @layer renderer-app @kind logic */
import type { PickHow } from '../sheet/sheet.type';

const rangeBetween = (order: readonly string[], from: string | undefined, to: string): string[] => {
  const a = from === undefined ? -1 : order.indexOf(from);
  const b = order.indexOf(to);
  if (a < 0 || b < 0) return [to];
  return order.slice(Math.min(a, b), Math.max(a, b) + 1);
};

const nextPicks = (order: readonly string[], current: readonly string[], key: string, how: PickHow): string[] => {
  if (how === 'toggle') return current.includes(key) ? current.filter((each) => each !== key) : [...current, key];
  if (how === 'range') return rangeBetween(order, current.at(-1), key);
  return [key];
};

export { nextPicks };
