/* @layer renderer-app @kind constants */
import type { AlignMode } from './align.type';

const ALIGN_TEXT = {
  group: 'Layout',
  byHand: 'Arrange by hand to align',
  pickMore: 'Pick more sprites on the sheet.',
  modes: {
    left: 'Align left edges',
    center: 'Align centers',
    right: 'Align right edges',
    top: 'Align top edges',
    middle: 'Align middles',
    bottom: 'Align bottom edges',
    horizontal: 'Space evenly across',
    vertical: 'Space evenly down',
  } as Readonly<Record<AlignMode, string>>,
  label: (mode: AlignMode, count: number): string => `${count === 1 ? 'Align sprite' : `Align ${count} sprites`}: ${mode}`,
} as const;

export { ALIGN_TEXT };
