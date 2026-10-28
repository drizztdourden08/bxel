/* @layer renderer-app @kind logic */
import { HEADER_TEXT } from './stage-header.constants';
import type { StateChipInput } from './state-chip.type';
import type { HeaderChip } from './stage-header.type';

const stateChip = ({ locked, readOnly, run }: StateChipInput): HeaderChip => ({
  id: 'layer-state',
  text: locked ? HEADER_TEXT.locked : HEADER_TEXT.hidden,
  tone: locked ? 'danger' : 'warning',
  icon: locked ? 'pixel-lock' : 'eye-off',
  title: locked ? HEADER_TEXT.lockedTitle : HEADER_TEXT.hiddenTitle,
  action: { label: locked ? HEADER_TEXT.unlock : HEADER_TEXT.show, disabled: readOnly, run },
});

export { stateChip };
