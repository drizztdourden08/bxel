/* @layer renderer-app @kind logic */
import type { ContextMenuEntry } from '@drizztdourden08/brock-react';
import { unless } from '../../../context-menu/unless';
import { ALIGN_MODES, MIN_DISTRIBUTE } from '../../../sheet-manager/align.constants';
import { ALIGN_TEXT } from '../../../sheet-manager/align-text.constants';
import type { CurrentManager } from '../../../sheet-manager/manager.type';
import { ARRANGE_KINDS } from './arrange-entries.constants';

const arrangeEntries = ({ sheet, ids }: Pick<CurrentManager, 'sheet' | 'ids'>): readonly ContextMenuEntry[] => {
  const manual = sheet?.layout.kind === 'manual';
  const onSheet = sheet ? ids.filter((id) => sheet.entries.some((entry) => entry.spriteId === id)).length : 0;
  return [
    ...ARRANGE_KINDS.map((each) => ({ command: each.command, label: each.label, kind: 'radio' as const, checked: sheet?.layout.kind === each.kind })),
    'separator',
    ...ALIGN_MODES.map((mode) => ({
      command: 'sheet.align',
      label: ALIGN_TEXT.modes[mode],
      args: { mode },
      ...unless(manual && onSheet >= (mode === 'horizontal' || mode === 'vertical' ? MIN_DISTRIBUTE : 2), manual ? ALIGN_TEXT.pickMore : ALIGN_TEXT.byHand),
    })),
  ];
};

export { arrangeEntries };
