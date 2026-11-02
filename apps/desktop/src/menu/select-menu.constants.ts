/* @layer renderer-app @kind config */
import { SELECTION_COMMAND_ID as ID } from '../keymap/selection-command-id.constants';
import { SLICE_COMMAND as SLICE } from '../keymap/slice-command-id.constants';

import type { SelectEntry } from './select-menu.type';

const SELECT_ENTRIES: readonly SelectEntry[] = [
  { id: ID.selectAll, label: 'Select all' },
  { id: ID.clear, label: 'Deselect' },
  { id: ID.reselect, label: 'Reselect' },
  { id: ID.invert, label: 'Invert selection' },
  'separator',
  { id: ID.expand, label: 'Expand selection' },
  { id: ID.shrink, label: 'Shrink selection' },
  { id: ID.border, label: 'Border selection' },
  { id: ID.smooth, label: 'Smooth selection' },
  { id: ID.selectOpaque, label: 'Select opaque pixels' },
  { id: ID.selectByFrame, label: 'Select by frame' },
  'separator',
  { id: ID.toGuides, label: 'Selection to guides' },
  { id: SLICE.fromSelection, label: 'Selection to slice' },
  { id: SLICE.toSelection, label: 'Slice to selection' },
  { id: ID.quickMask, label: 'Quick mask' },
  { id: ID.save, label: 'Saved selections...' },
];

export { SELECT_ENTRIES };
