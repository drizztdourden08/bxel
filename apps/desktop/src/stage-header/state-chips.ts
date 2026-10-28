/* @layer renderer-app @kind logic */
import { HEADER_TEXT } from './stage-header.constants';
import type { HeaderChip, HeaderInput } from './stage-header.type';

const stateChips = (input: HeaderInput): HeaderChip[] => [
  ...(input.readOnly ? [{ id: 'read-only', text: HEADER_TEXT.readOnly, tone: 'warning' as const, icon: 'pixel-lock' as const, title: HEADER_TEXT.readOnlyTitle }] : []),
  ...(input.hiddenGrids ? [{ id: 'grid-hidden', text: HEADER_TEXT.gridHidden, tone: 'neutral' as const, title: HEADER_TEXT.gridHiddenTitle }] : []),
];

export { stateChips };
