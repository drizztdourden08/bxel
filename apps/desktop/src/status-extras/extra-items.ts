/* @layer renderer-app @kind logic */
import type { StatusBarEntry } from '@drizztdourden08/tessera';
import { EXTRA_TEXT } from './status-extras.constants';
import type { StatusExtras } from './status-extras.type';

const entry = (id: string, label: string, value: string | null, rest: Partial<StatusBarEntry> = {}): StatusBarEntry[] =>
  value === null ? [] : [{ id, label, value, ...rest }];

const extraItems = (extras: StatusExtras): StatusBarEntry[] => [
  ...entry('index', EXTRA_TEXT.index, extras.index?.text ?? null, { swatch: extras.index?.swatch, priority: 3 }),
  ...entry('cell', EXTRA_TEXT.cell, extras.cell, { priority: 2 }),
  ...entry('cell-tile', EXTRA_TEXT.tile, extras.tile, { priority: 2 }),
  ...entry('selection', EXTRA_TEXT.selection, extras.selection, { priority: 3 }),
  ...entry('drag', EXTRA_TEXT.drag, extras.drag, { tone: 'info', priority: 3 }),
  ...entry('frame', EXTRA_TEXT.frame, extras.frame, { priority: 2 }),
];

export { extraItems };
