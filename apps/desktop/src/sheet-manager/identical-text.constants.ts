/* @layer renderer-app @kind constants */
import type { IdenticalMode, Orientation } from './identical.type';

const IDENTICAL_TEXT = {
  group: 'Find',
  selectDuplicates: 'Select duplicate sprites',
  selectDuplicatesFlipped: 'Select duplicates, flips included',
  none: 'No identical sprites were found.',
  filter: 'Identical sprites',
  modes: { off: 'Any sprite', same: 'Same pixels', flips: 'Same or flipped' } as Readonly<Record<IdenticalMode, string>>,
  badge: 'Identical to another sprite',
  compare: 'Compare two sprites',
  compareTitle: 'Compare sprites',
  compareNeedTwo: 'Pick exactly two sprites to compare.',
  close: 'Close',
  difference: 'Difference',
  sizeLine: (width: number, height: number): string => `${width} by ${height}`,
  frameLine: (count: number): string => (count === 1 ? '1 frame' : `${count} frames`),
  pivotLine: (text: string): string => `Pivot ${text}`,
  identical: 'The two sprites are identical.',
  flipped: (how: Exclude<Orientation, 'none'>): string =>
    how === 'both' ? 'The second sprite is the first one turned half way round.' : `The second sprite is the first one flipped ${how}ly.`,
  differs: (count: number, total: number): string => `${count} of ${total} pixels differ in the first frame.`,
  sizesDiffer: (first: string, second: string): string => `The sizes differ: ${first} and ${second}.`,
} as const;

export { IDENTICAL_TEXT };
