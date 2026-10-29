/* @layer core @kind logic */
import type { OutlineOptions } from './outline.type';

/** The colour an edge pixel takes, or null when the outline leaves it alone. */
const outlineColour = (options: OutlineOptions, own: number, touching: number): number | null => {
  const base = options.side === 'inside' ? own : touching;
  if (options.darker === undefined) return options.index ?? null;
  return options.darker[base] ?? base;
};

export { outlineColour };
