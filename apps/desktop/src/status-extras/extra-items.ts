/* @layer renderer-app @kind logic */
import type { StatusBarEntry } from '@drizztdourden08/tessera';
import { EXTRA_TEXT } from './status-extras.constants';
import type { StatusExtras } from './status-extras.type';

const entry = (id: string, label: string, value: string | null, rest: Partial<StatusBarEntry> = {}): StatusBarEntry[] =>
  value === null ? [] : [{ id, label, value, ...rest }];

const extraItems = (extras: StatusExtras): StatusBarEntry[] => [
  ...entry('index', EXTRA_TEXT.index, extras.index?.text ?? null, { swatch: extras.index?.swatch }),
  ...entry('cell', EXTRA_TEXT.cell, extras.cell),
  ...entry('tile', EXTRA_TEXT.tile, extras.tile),
  ...entry('selection', EXTRA_TEXT.selection, extras.selection),
  ...entry('drag', EXTRA_TEXT.drag, extras.drag, { tone: 'info' }),
  ...entry('frame', EXTRA_TEXT.frame, extras.frame),
];

export { extraItems };
