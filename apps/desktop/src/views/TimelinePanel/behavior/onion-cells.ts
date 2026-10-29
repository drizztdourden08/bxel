/* @layer renderer-app @kind logic */
import type { OnionCell } from './onion-cells.type';

const onionCells = (before: number, after: number): OnionCell[] => [
  ...Array.from({ length: before }, (_, index): OnionCell => ({ key: `b${index}`, side: 'before', step: before - index })),
  { key: 'now', side: 'now', step: 0 },
  ...Array.from({ length: after }, (_, index): OnionCell => ({ key: `a${index}`, side: 'after', step: index + 1 })),
];

export { onionCells };
